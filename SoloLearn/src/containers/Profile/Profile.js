// React modules
import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { CodesList, AddCodeButton } from 'containers/Playground/components';
import BusyWrapper from 'components/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shimmers/ProfileHeaderShimmer';
import FeedList from 'containers/Feed/FeedList';
import QuestionList, { AddQuestionButton } from 'containers/Discuss/QuestionsList';
import {
	Tabs,
	Tab,
	TextBlock,
	PaperContainer,
	Container,
} from 'components/atoms';
import { LayoutWithSidebar, InfiniteScroll, FloatingActionButton } from 'components/molecules';
import { Feed, Add } from 'components/icons';
import { ProfileFeed } from './components';
import 'containers/Discuss/QuestionsList/styles.scss';
import 'styles/Profile/index.scss';
import Header from './Header';
import Skills from './Skills';
import Badges from './Badges';
import FollowersBase from './FollowersBase';
import ProfileSidebar from './ProfileSidebar';
import IProfile from './IProfile';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);
const TABS = {
	codes: 'codes',
	discussion: 'discussion',
	activity: 'activity',
	skills: 'skills',
	badges: 'badges',
};

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
		const { id, tab } = this.props.params;
		if (!id) {
			browserHistory.replace({
				...this.props.location,
				pathname: `/profile/${this.props.userId}/${TABS.activity}`,
			});
			return;
		}
		if (TABS[id]) { // if first parameter is tab name
			browserHistory.replace({
				...this.props.location,
				pathname: `/profile/${this.props.userId}/${id}`,
			});
			return;
		}

		this.handleTabChange(null, tab || TABS.activity);
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
				pathname: `/profile/${id}/${tab || TABS.activity}`,
			});
			this.activeTab = tab || 'activity';
		}
	}

	@action handleTabChange = (_, activeTab) => {
		const { location, params } = this.props;
		this.activeTab = activeTab;
		browserHistory.replace({
			...location,
			pathname: `/profile/${params.id}/${this.activeTab}`,
		});
		ReactGA.ga('send', 'screenView', { screenName: `Profile ${capitalize(this.activeTab)} Page` });
	}

	@action toggleFollowerPopup = () => {
		this.followerPopupOpen = !this.followerPopupOpen;
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
			<LayoutWithSidebar className="profile-container" sidebar={<ProfileSidebar />}>
				<PaperContainer className="profile-overlay">
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
						>
							<Tab
								value={TABS.codes}
								label={<TextBlock>{t('profile.tab.codes')}</TextBlock>}
								icon={<TextBlock>{data.codes}</TextBlock>}
							/>
							<Tab
								value={TABS.discussion}
								label={<TextBlock>{t('profile.tab.posts')}</TextBlock>}
								icon={<TextBlock>{data.posts}</TextBlock>}
							/>
							<Tab
								value={TABS.activity}
								label={<TextBlock>{t('profile.tab.activity')}</TextBlock>}
								icon={<Feed className="feed-icon" />}
							/>
							<Tab
								value={TABS.skills}
								label={<TextBlock>{t('profile.tab.skills')}</TextBlock>}
								icon={
									<TextBlock>
										{data.skills ? data.skills.length : 0}
									</TextBlock>
								}
							/>
							<Tab
								value={TABS.badges}
								label={<TextBlock>{t('profile.tab.badges')}</TextBlock>}
								icon={
									<TextBlock>
										{data.badges ? data.badges.filter(item => item.isUnlocked).length : 0}
									</TextBlock>
								}
							/>
						</Tabs>
					</BusyWrapper>
				</PaperContainer>
				{
					data.id !== undefined && this.activeTab === TABS.activity &&
					<ProfileFeed
						feed={feed.entities}
						hasMore={feed.hasMore}
						loadMore={this.profile.getFeed}
						voteFeedItem={this.profile.voteFeedItem}
						loading={this.profile.getFeedPromise !== null}
						showFab={data.id === userId}
					/>
				}
				{
					data.id !== undefined && this.activeTab === TABS.codes &&
					<InfiniteScroll
						hasMore={codes.hasMore}
						isLoading={this.profile.isCodesFetching}
						loadMore={this.profile.getCodes}
					>
						<PaperContainer className="codes-wrapper section">
							<CodesList
								codes={codes.entities}
								hasMore={codes.hasMore}
								loadMore={this.profile.getCodes}
							/>
							{data.id === userId &&
								<AddCodeButton>
									{({ togglePopup }) => <FloatingActionButton alignment="right" onClick={togglePopup} ><Add /></FloatingActionButton>}
								</AddCodeButton>
							}
						</PaperContainer>
					</InfiniteScroll>
				}
				{
					data.id !== undefined && this.activeTab === TABS.discussion && (
						<InfiniteScroll
							hasMore={questions.hasMore}
							isLoading={this.profile.isQuestionsFetching}
							loadMore={this.profile.getQuestions}
						>
							<PaperContainer className="discuss_questions-list">
								<QuestionList
									questions={questions.entities}
									hasMore={questions.hasMore}
								/>
								{data.id === userId &&
									<AddQuestionButton />
								}
							</PaperContainer>
						</InfiniteScroll>
					)
				}
				{
					data.id !== undefined && this.activeTab === TABS.skills &&
					<Skills
						levels={levels}
						profile={data}
						currentUserId={userId}
						skills={data.skills}
					/>
				}
				{
					data.id !== undefined && this.activeTab === TABS.badges && data.badges &&
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
			</LayoutWithSidebar>
		);
	}
}

const mapStateToProps = state => ({
	levels: state.levels,
	userId: state.userProfile.id,
});

export default connect(mapStateToProps)(Profile);
