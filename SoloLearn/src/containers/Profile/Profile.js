// React modules
import React, { Component } from 'react';
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
import { getFeedItemsInternal } from 'actions/feed';
import { emptyProfileFollowers, emptyProfile, getProfileQuestionsInternal, getProfileInternal } from 'actions/profile';
import { isLoaded } from 'reducers';

import Layout from 'components/Layouts/GeneralLayout';
import AddCodeButton from 'components/AddCodeButton';
import AddQuestionButton from 'components/AddQuestionButton';
import BusyWrapper from 'components/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shimmers/ProfileHeaderShimmer';

import 'styles/Profile/index.scss';

// Additional data and components
import { QuestionList } from 'components/Questions';
import Header from './Header';
import FeedItemsBase from '../Feed/FeedItemsBase';
import CodesList from '../Playground/CodesList';
import Skills from './Skills';
import Badges from './Badges';
import FollowersBase from './FollowersBase';
import TabLabel from './ProfileTabLabel';

const capitalize = name => name.charAt(0).toUpperCase() + name.substr(1);

@translate()
class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'Activity',
			popupOpened: false,
			loading: true,
		};
	}

	async componentWillMount() {
		const { params } = this.props;
		const { tab = '', selected } = params;
		// If there is a selected badge then the logic is a
		// little bit different.
		if (selected) {
			this.handleSelectedChange(selected);
		} else {
			// Default tab is activity so wee need to
			// Arrange route and GA accordingly.
			this.handleTabChange(tab || 'activity');
		}
		if (this.props.isLoaded && this.props.profile.data.id.toString() !== params.id) {
			this.props.clearOpenedProfile();
		}
		await this.props.getProfile(params.id);
		this.setState({ loading: false });
		document.title = `${this.props.profile.data.name}'s Profile`;
		ReactGA.ga('send', 'screenView', { screenName: 'Profile Page' });
	}

	async componentWillReceiveProps(newProps) {
		const { getProfile, params } = this.props;
		const { params: { id, tab, selected } } = newProps;
		if (params.id !== id) {
			this.props.emptyProfileFollowers();
			this.setState({ popupOpened: false });
			this.props.clearOpenedProfile();
			this.setState({ loading: true });
			await getProfile(id);
			this.setState({ loading: false });
		} else if (params.tab !== tab) {
			if (selected && selected !== params.selected) {
				this.handleSelectedChange(selected);
			} else {
				this.handleTabChange(tab);
			}
		}
	}

	handleSelectedChange = (selectedOverride) => {
		const { params: { id, selected } } = this.props;
		this.setState({ activeTab: 'badges' });
		browserHistory.replace(`/profile/${id}/badges/${selected || selectedOverride || ''}`);
		ReactGA.ga('send', 'screenView', { screenName: 'Profile Badges Page' });
	}

	handleTabChange = (activeTab) => {
		const { params: { id } } = this.props;
		this.setState({ activeTab });
		browserHistory.replace(`/profile/${id}/${activeTab}`);
		ReactGA.ga('send', 'screenView', { screenName: `Profile ${capitalize(activeTab)} Page` });
	}

	handlePopupOpen = () => {
		this.setState({ popupOpened: true });
	}

	handlePopupClose = () => {
		this.props.emptyProfileFollowers();
		this.setState({ popupOpened: false });
	}

	loadFeedItems = async (fromId, userId) => {
		try {
			await this.props.getProfileFeedItems(fromId, userId);
		} catch (e) {
			console.log(e);
		}
	}

	loadMoreQuestions = () => {
		const { profile } = this.props;
		// if (profile.data.id != null) {
		const index = profile.posts.questions !== null ? profile.posts.questions.length : 0;
		this.props.getQuestions({
			index,
			profileId: profile.data.id,
		});
		// }
	}

	render() {
		const {
			t,
			levels,
			userId,
			profile,
			params: { id, selected },
		} = this.props;

		const { loading, popupOpened, activeTab } = this.state;

		return (
			<Layout className="profile-container">
				<Paper className="profile-overlay">
					<BusyWrapper
						isBusy={loading}
						style={{ display: 'initial' }}
						loadingComponent={<ProfileHeaderShimmer />}
					>
						<Header
							levels={levels}
							profile={profile.data}
							openPopup={this.handlePopupOpen}
						/>
						<Tabs
							value={activeTab}
							onChange={this.handleTabChange}
							inkBarStyle={{ backgroundColor: '#777777' }}
							tabItemContainerStyle={{ backgroundColor: 'white' }}
						>
							<Tab
								value="codes"
								style={{ color: '#676667' }}
								label={<TabLabel data={profile.data.codes} label={t('profile.tab.codes')} />}
							/>
							<Tab
								value="discussion"
								style={{ color: '#676667' }}
								label={<TabLabel data={profile.data.posts} label={t('profile.tab.posts')} />}
							/>
							<Tab
								value="activity"
								style={{ color: '#676667' }}
								label={<TabLabel icon={<FeedIcon color={grey600} />} label={t('profile.tab.activity')} />}
							/>
							<Tab
								value="skills"
								style={{ color: '#676667' }}
								label={<TabLabel data={profile.data.skills ? profile.data.skills.length : 0} label={t('profile.tab.skills')} />}
							/>
							<Tab
								value="badges"
								style={{ color: '#676667' }}
								label={<TabLabel data={profile.data.badges ? profile.data.badges.filter(item => item.isUnlocked).length : 0} label={t('profile.tab.badges')} />}
							/>
						</Tabs>
					</BusyWrapper>
				</Paper>
				{
					activeTab === 'activity' &&
					<div className="section">
						<FeedItemsBase
							isLoaded={profile.feed.length > 0}
							feed={profile.feed}
							feedPins={[]}
							isUserProfile
							userId={id}
						/>
					</div>
				}
				{
					activeTab === 'codes' &&

					<Paper className="codes-wrapper section">
						<CodesList
							codes={profile.codes}
							hasMore
						/>
						{profile.data.id === userId &&
							<AddCodeButton />
						}
					</Paper>
				}
				{
					activeTab === 'discussion' &&
					<Paper className="discussion-wrapper section">
						<QuestionList
							questions={profile.posts.questions}
							hasMore={profile.posts.hasMore}
							loadMore={this.loadMoreQuestions}
						/>
						{profile.data.id === userId &&
							<AddQuestionButton />
						}
					</Paper>
				}
				{activeTab === 'skills' &&
					<Skills
						levels={levels}
						profile={profile.data}
						currentUserId={userId}
						skills={profile.data.skills}
					/>}
				{activeTab === 'badges' &&
					<Badges badges={profile.data.badges} selectedId={selected || null} />}
				<Dialog
					modal={false}
					open={popupOpened}
					onRequestClose={this.handlePopupClose}
				>
					<FollowersBase t={t} userId={profile.data.id} closePopup={this.handlePopupClose} />
				</Dialog>
			</Layout>
		);
	}
}

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'profile'),
	profile: state.profile,
	levels: state.levels,
	userId: state.userProfile.id,
});

const mapDispatchToProps = {
	getProfileFeedItems: getFeedItemsInternal,
	getProfile: getProfileInternal,
	emptyProfileFollowers,
	clearOpenedProfile: emptyProfile,
	getQuestions: getProfileQuestionsInternal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
