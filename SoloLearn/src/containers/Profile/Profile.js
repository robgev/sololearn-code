// React modules
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';

// Material UI components
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import FeedIcon from 'material-ui/svg-icons/image/dehaze';
import { grey600 } from 'material-ui/styles/colors';

// Redux modules
import { connect } from 'react-redux';
import { PaperContainer } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';
import Layout from 'components/Layouts/GeneralLayout';
import AddCodeButton from 'components/AddCodeButton';
import FloatingButton from 'components/AddCodeButton/FloatingButton';
import BusyWrapper from 'components/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shimmers/ProfileHeaderShimmer';
import { CodesList } from 'containers/Playground/components';
import FeedList from 'containers/Feed/FeedList';
import QuestionList from 'containers/Discuss/QuestionsList';
import 'containers/Discuss/QuestionsList/styles.scss';

import 'styles/Profile/index.scss';

// Additional data and components
import Header from './Header';
import Skills from './Skills';
import Badges from './Badges';
import TabLabel from './ProfileTabLabel';
import FollowersBase from './FollowersBase';
import ProfileSidebar from './ProfileSidebar';

import IProfile from './IProfile';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);

@translate()
@observer
class Profile extends Component {
	@observable activeTab = 'activity';
	@observable profile = new IProfile({
		id: parseInt(this.props.params.id, 10),
		isMe: parseInt(this.props.params.id, 10) === this.props.userId,
	});

	@observable followerPopupOpen = false;

	componentWillMount() {
		const { tab } = this.props.params;
		this.handleTabChange(tab || 'activity');
		ReactGA.ga('send', 'screenView', { screenName: 'Profile Page' });
	}

	componentWillReceiveProps(newProps) {
		const { id, tab } = newProps.params;
		if (this.props.params.id !== id) {
			this.profile = new IProfile({ id });
			this.followerPopupOpen = false;
		}
		if (tab !== this.activeTab) {
			const { location } = newProps;
			browserHistory.replace({
				...location,
				pathname: `/profile/${id}/${tab || 'activity'}`,
			});
			this.activeTab = tab || 'activity';
		}
	}

	@action handleTabChange = (activeTab) => {
		this.activeTab = activeTab;
		browserHistory.replace(`/profile/${this.props.params.id}/${this.activeTab}`);
		ReactGA.ga('send', 'screenView', { screenName: `Profile ${capitalize(this.activeTab)} Page` });
	}

	@action toggleFollowerPopup = () => {
		const shouldBeOpen = !this.followerPopupOpen;
		if (!shouldBeOpen) {
			this.profile.clearFollowData();
		}
		this.followerPopupOpen = shouldBeOpen;
	}

	render() {
		const {
			data, questions, codes, feed,
		} = this.profile;
		const {
			t,
			levels,
			userId,
		} = this.props;

		return (
			<Layout className="profile-container" sidebarContent={<ProfileSidebar />}>
				<Paper className="profile-overlay">
					<BusyWrapper
						isBusy={data.id === undefined}
						style={{ display: 'initial' }}
						loadingComponent={<ProfileHeaderShimmer />}
					>
						<Header
							levels={levels}
							profile={data}
							openFollowerPopup={this.toggleFollowerPopup}
							onFollow={this.profile.onFollowUser}
						/>
						<Tabs
							value={this.activeTab}
							onChange={this.handleTabChange}
							inkBarStyle={{ backgroundColor: '#777777' }}
							tabItemContainerStyle={{ backgroundColor: 'white' }}
						>
							<Tab
								value="codes"
								style={{ color: '#676667' }}
								label={<TabLabel data={data.codes} label={t('profile.tab.codes')} />}
							/>
							<Tab
								value="discussion"
								style={{ color: '#676667' }}
								label={<TabLabel data={data.posts} label={t('profile.tab.posts')} />}
							/>
							<Tab
								value="activity"
								style={{ color: '#676667' }}
								label={<TabLabel icon={<FeedIcon color={grey600} />} label={t('profile.tab.activity')} />}
							/>
							<Tab
								value="skills"
								style={{ color: '#676667' }}
								label={<TabLabel data={data.skills ? data.skills.length : 0} label={t('profile.tab.skills')} />}
							/>
							<Tab
								value="badges"
								style={{ color: '#676667' }}
								label={<TabLabel data={data.badges ? data.badges.filter(item => item.isUnlocked).length : 0} label={t('profile.tab.badges')} />}
							/>
						</Tabs>
					</BusyWrapper>
				</Paper>
				{
					this.activeTab === 'activity' &&
					<div className="section">
						<FeedList
							feed={feed.entities}
							hasMore={feed.hasMore}
							loadMore={this.profile.getFeed}
							voteFeedItem={this.profile.voteFeedItem}
						/>
					</div>
				}
				{
					this.activeTab === 'codes' &&
					<div className="codes-wrapper section">
						<CodesList
							codes={codes.entities}
							hasMore={codes.hasMore}
							loadMore={this.profile.getCodes}
						/>
						{data.id === userId &&
							<AddCodeButton>
								{({ togglePopup }) => <FloatingButton onClick={togglePopup} />}
							</AddCodeButton>
						}
					</div>
				}
				{
					this.activeTab === 'discussion' && (
						<InfiniteScroll
							hasMore={questions.hasMore}
							isLoading={this.profile.isQuestionsFetching}
							loadMore={this.profile.getQuestions}
						>
							{/* <AddButton /> */}
							<PaperContainer className="discuss_questions-list">
								<QuestionList
									questions={questions.entities}
									isLoading={this.profile.isQuestionsFetching}
								/>
							</PaperContainer>
						</InfiniteScroll>
					)
				}
				{
					this.activeTab === 'skills' &&
					<Skills
						levels={levels}
						profile={data}
						currentUserId={userId}
						skills={data.skills}
					/>
				}
				{
					this.activeTab === 'badges' && data.badges &&
					<Badges
						badges={data.badges}
						key={this.props.location.query.badgeID || 0}
						selectedId={this.props.location.query.badgeID || 0}
					/>
				}
				<FollowersBase
					open={this.followerPopupOpen}
					profile={this.profile}
					closePopup={this.toggleFollowerPopup}
				/>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	levels: state.levels,
	userId: state.userProfile.id,
});

export default connect(mapStateToProps)(Profile);
