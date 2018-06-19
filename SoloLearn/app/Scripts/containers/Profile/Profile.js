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
import { getCodesInternal } from 'actions/playground';
import { getQuestionsInternal } from 'actions/discuss';
import { getProfileInternal } from 'actions/defaultActions';
import { emptyProfileFollowers, emptyProfile } from 'actions/profile';
import { isLoaded } from 'reducers';

import Layout from 'components/Layouts/GeneralLayout';
import AddCodeButton from 'components/Shared/AddCodeButton';
import AddQuestionButton from 'components/Shared/AddQuestionButton';
import BusyWrapper from 'components/Shared/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shared/Shimmers/ProfileHeaderShimmer';

// Utils
import { EnumNameMapper } from 'utils';

// Additional data and components
import Header from './Header';
import FeedItemsBase from '../Feed/FeedItemsBase';
import Codes from '../Playground/Codes';
import Questions from '../Discuss/Questions';
import Skills from './Skills';
import Badges from './Badges';
import FollowersBase from './FollowersBase';

const TabTypes = {
	Codes: 1,
	Posts: 2,
	Activity: 3,
	Skills: 4,
	Badges: 5,
};
EnumNameMapper.apply(TabTypes);

const styles = {
	cover: {
		height: '200px',
		backgroundColor: '#607d8b',
	},

	userInfo: {
		textAlign: 'center',
		width: '100%',
	},

	tabs: {
		backgroundColor: '#fff',
	},

	tab: {
		color: 'rgba(107, 104, 104, 0.8)',
	},

	tabIcon: {
	},

	label: {
		display: 'inline-block',
	},

	inkBarStyle: {
		backgroundColor: '#777',
	},

	section: {
		position: 'relative',
		padding: 15,
	},

	popup: {
		padding: 0,
	},
};
@translate()
class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: TabTypes.Activity,
			popupOpened: false,
			loading: true,
		};
	}

	async componentWillMount() {
		const { params } = this.props;
		const { tab = '' } = params;
		if (this.props.isLoaded && this.props.profile.data.id.toString() !== params.id) {
			this.props.clearOpenedProfile();
		}
		await this.props.getProfile(params.id);
		this.selectTab(tab);
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
			this.selectTab(tab, selected);
		}
	}

	getLabel = (type) => {
		const { t, profile: { data } } = this.props;

		switch (type) {
		case TabTypes.Codes:
			return (
				<div style={styles.label}>
					<p>{data.codes}</p>
					<p>{t('profile.tab.codes')}</p>
				</div>
			);
		case TabTypes.Posts:
			return (
				<div style={styles.label}>
					<p>{data.posts}</p>
					<p>{t('profile.tab.posts')}</p>
				</div>
			);
		case TabTypes.Skills:
			return (
				<div style={styles.label}>
					<p>{data.skills ? data.skills.length : 0}</p>
					<p>{t('profile.tab.skills')}</p>
				</div>
			);
		case TabTypes.Badges:
			return (
				<div style={styles.label}>
					<p>{data.badges ? data.badges.filter(item => item.isUnlocked).length : 0}</p>
					<p>{t('profile.tab.badges')}</p>
				</div>
			);
		case TabTypes.Activity:
			return (
				<div style={styles.label}>
					<FeedIcon color={grey600} />
					<p>{t('profile.tab.activity')}</p>
				</div>
			);
		default:
			return null;
		}
	}

	handleTabChange = (value, selected) => {
		this.setState({ activeTab: value });
		switch (value) {
		case TabTypes.Activity:
			browserHistory.replace(`/profile/${this.props.params.id}/activity`);
			ReactGA.ga('send', 'screenView', { screenName: 'Profile Feed Page' });
			break;
		case TabTypes.Codes:
			browserHistory.replace(`/profile/${this.props.params.id}/codes`);
			ReactGA.ga('send', 'screenView', { screenName: 'Profile Codes Page' });
			break;
		case TabTypes.Posts:
			browserHistory.replace(`/profile/${this.props.params.id}/posts`);
			ReactGA.ga('send', 'screenView', { screenName: 'Profile Discussion Page' });
			break;
		case TabTypes.Skills:
			browserHistory.replace(`/profile/${this.props.params.id}/skills`);
			ReactGA.ga('send', 'screenView', { screenName: 'Profile Skills Page' });
			break;
		case TabTypes.Badges:
			browserHistory.replace(`/profile/${this.props.params.id}/badges/${this.props.params.selected || selected || ''}`);
			ReactGA.ga('send', 'screenView', { screenName: 'Profile Badges Page' });
			break;
		default:
			break;
		}
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

	selectTab = (tab, selected) => {
		switch (tab.toLowerCase()) {
		case 'activity':
			this.handleTabChange(TabTypes.Activity);
			break;
		case 'codes':
			this.handleTabChange(TabTypes.Codes);
			break;
		case 'posts':
			this.handleTabChange(TabTypes.Posts);
			break;
		case 'skills':
			this.handleTabChange(TabTypes.Skills);
			break;
		case 'badges':
			this.handleTabChange(TabTypes.Badges, selected);
			break;
		default:
			browserHistory.replace(`/profile/${this.props.params.id}/activity`);
			this.handleTabChange(TabTypes.Activity);
			break;
		}
	}

	render() {
		const {
			t,
			levels,
			userId,
			profile,
		} = this.props;

		const { loading } = this.state;

		return (
			<Layout>
				<Paper className="profile-overlay" style={styles.userInfo}>
					<BusyWrapper
						isBusy={loading}
						style={{ display: 'initial' }}
						loadingComponent={<ProfileHeaderShimmer />}
					>
						<Header
							profile={profile.data}
							levels={this.props.levels}
							openPopup={this.handlePopupOpen}
						/>
						<Tabs
							value={this.state.activeTab}
							tabItemContainerStyle={styles.tabs}
							inkBarStyle={styles.inkBarStyle}
						>
							<Tab
								label={this.getLabel(TabTypes.Codes)}
								value={TabTypes.Codes}
								style={styles.tab}
								onClick={() => this.handleTabChange(TabTypes.Codes)}
							/>
							<Tab
								label={this.getLabel(TabTypes.Posts)}
								value={TabTypes.Posts}
								style={styles.tab}
								onClick={() => this.handleTabChange(TabTypes.Posts)}
							/>
							<Tab
								label={this.getLabel(TabTypes.Activity)}
								value={TabTypes.Activity}
								style={styles.tab}
								onClick={() => this.handleTabChange(TabTypes.Activity)}
							/>
							<Tab
								label={this.getLabel(TabTypes.Skills)}
								value={TabTypes.Skills}
								style={styles.tab}
								onClick={() => this.handleTabChange(TabTypes.Skills)}
							/>
							<Tab
								label={this.getLabel(TabTypes.Badges)}
								value={TabTypes.Badges}
								style={styles.tab}
								onClick={() => this.handleTabChange(TabTypes.Badges)}
							/>
						</Tabs>
					</BusyWrapper>
				</Paper>
				{
					this.state.activeTab === TabTypes.Activity &&
						<div className="section" style={styles.section}>
							<FeedItemsBase
								isLoaded={profile.feed.length > 0}
								feed={profile.feed}
								feedPins={[]}
								isUserProfile
								userId={userId}
							/>
						</div>
				}
				{
					this.state.activeTab === TabTypes.Codes &&
						<Paper className="codes-wrapper section" style={styles.section}>
							<Codes
								t={t}
								codes={profile.codes}
								isLoaded={profile.codes.length > 0}
								ordering={3}
								language=""
								isUserProfile
								userId={profile.data.id}
							/>
							<AddCodeButton />
						</Paper>
				}
				{
					this.state.activeTab === TabTypes.Posts &&
						<Paper className="section" style={styles.section}>
							<Questions
								t={t}
								questions={profile.posts}
								isLoaded={profile.posts.length > 0}
								ordering={7}
								query=""
								userId={profile.data.id}
							/>
							<AddQuestionButton />
						</Paper>
				}
				{this.state.activeTab === TabTypes.Skills &&
					<Skills
						levels={levels}
						profile={profile.data}
						currentUserId={userId}
						skills={profile.data.skills}
					/>}
				{this.state.activeTab === TabTypes.Badges &&
					<Badges badges={profile.data.badges} selectedId={this.props.params.selected || null} />}
				<Dialog
					modal={false}
					open={this.state.popupOpened}
					onRequestClose={this.handlePopupClose}
					style={styles.popupOverlay}
					bodyStyle={styles.popup}
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
	getProfileCodes: getCodesInternal,
	getProfileQuestions: getQuestionsInternal,
	getProfile: getProfileInternal,
	emptyProfileFollowers,
	clearOpenedProfile: emptyProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
