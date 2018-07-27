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
import Dialog from 'material-ui/Dialog';
import { grey600 } from 'material-ui/styles/colors';

// Redux modules
import { connect } from 'react-redux';

import Layout from 'components/Layouts/GeneralLayout';
import AddCodeButton from 'components/AddCodeButton';
import AddQuestionButton from 'components/AddQuestionButton';
import BusyWrapper from 'components/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shimmers/ProfileHeaderShimmer';
import CodesList from 'containers/Playground/CodesList';

import 'styles/Profile/index.scss';

// Additional data and components
import { QuestionList } from 'components/Questions';
import Header from './Header';
import Skills from './Skills';
import Badges from './Badges';
import TabLabel from './ProfileTabLabel';
import FollowersBase from './FollowersBase';

import IProfile from './IProfile';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);

@translate()
@observer
class Profile extends Component {
	@observable activeTab = 'activity';
	@observable profile = new IProfile({ id: this.props.params.id });

	@observable followerPopupOpen = false;

	componentWillMount() {
		const { tab } = this.props.params;
		this.handleTabChange(tab || 'activity');
		ReactGA.ga('send', 'screenView', { screenName: 'Profile Page' });
	}

	componentWillReceiveProps(newProps) {
		const { id } = newProps.params;
		if (this.props.params.id !== id) {
			this.profile = new IProfile(id);
		}
	}

	@action handleTabChange = (activeTab) => {
		this.activeTab = activeTab;
		const { location } = this.props;
		location.pathname = `/profile/${this.props.params.id}/${this.activeTab}`;
		if (activeTab !== 'badges') {
			location.query = {};
		}
		browserHistory.replace(location);
		ReactGA.ga('send', 'screenView', { screenName: `Profile ${capitalize(this.activeTab)} Page` });
	}

	@action toggleFollowerPopup = () => {
		this.followerPopupOpen = !this.followerPopupOpen;
	}

	render() {
		const {
			data, questions, codes,
		} = this.profile;
		const {
			t,
			levels,
			userId,
		} = this.props;

		return (
			<Layout className="profile-container">
				<Paper className="profile-overlay">
					<BusyWrapper
						isBusy={data.id === undefined}
						style={{ display: 'initial' }}
						loadingComponent={<ProfileHeaderShimmer />}
					>
						<Header
							levels={levels}
							profile={data}
							openPopup={this.toggleFollowerPopup}
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
						{/* <FeedItemsBase
							isLoaded={profile.feed.length > 0}
							feed={profile.feed}
							feedPins={[]}
							isUserProfile
							userId={id}
						/> */}
						Profile feed
					</div>
				}
				{
					this.activeTab === 'codes' &&
					<Paper className="codes-wrapper section">
						<CodesList
							codes={codes.entities}
							hasMore={codes.hasMore}
							loadMore={this.profile.getCodes}
						/>
						{data.id === userId &&
							<AddCodeButton />
						}
					</Paper>
				}
				{
					this.activeTab === 'discussion' &&
					<div className="discussion-wrapper section">
						<QuestionList
							questions={questions.entities}
							hasMore={questions.hasMore}
							loadMore={this.profile.getQuestions}
						/>
						{data.id === userId &&
							<AddQuestionButton />
						}
					</div>
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
					<Badges badges={data.badges} selectedId={this.props.location.query.badgeID || 0} />}
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
