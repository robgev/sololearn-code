// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

// Material UI components
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import FeedIcon from 'material-ui/svg-icons/image/dehaze';
import Dialog from 'material-ui/Dialog';
import { grey600 } from 'material-ui/styles/colors';

// Redux modules
import { connect } from 'react-redux';
import { getFeedItemsInternal } from '../../actions/feed';
import { getCodesInternal } from '../../actions/playground';
import { getQuestionsInternal } from '../../actions/discuss';
import { getProfileInternal, clearOpenedProfile } from '../../actions/defaultActions';
import { emptyProfileFollowers } from '../../actions/profile';
import { isLoaded } from '../../reducers';

// Additional data and components
import Header from './Header';
import FeedItemsBase from '../Feed/FeedItemsBase';
import Codes from '../Playground/Codes';
import Questions from '../Discuss/Questions';
import Skills from './Skills';
import Badges from './Badges';
import FollowersBase from './FollowersBase';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

// Utils
import EnumNameMapper from '../../utils/enumNameMapper';

const TabTypes = {
	Codes: 1,
	Posts: 2,
	Activity: 3,
	Skills: 4,
	Badges: 5,
};
EnumNameMapper.apply(TabTypes);

const styles = {
	container: {
		width: '100%',
		position: 'relative',
		minHeight: '100px',
	},

	cover: {
		height: '200px',
		backgroundColor: '#607d8b',
	},

	profileOverlay: {
		width: '1000px',
		margin: '-100px auto 0',
	},

	userInfo: {
		padding: '20px 0 0 0',
		textAlign: 'center',
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
	},

	popup: {
		padding: 0,
	},
};

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: TabTypes.Activity,
			popupOpened: false,
		};
	}

	async componentWillMount() {
		const { params } = this.props;
		const { tab = '' } = params;
		await this.props.getProfile(params.id);
		this.selectTab(tab);
	}

	componentWillUnmount() {
		this.props.clearOpenedProfile();
	}

	getLabel = (type) => {
		const { profile } = this.props;

		switch (type) {
		case TabTypes.Codes:
			return (
				<div style={styles.label}>
					<p>{profile.data.codes}</p>
					<p>Codes</p>
				</div>
			);
		case TabTypes.Posts:
			return (
				<div style={styles.label}>
					<p>{profile.data.posts}</p>
					<p>Posts</p>
				</div>
			);
		case TabTypes.Skills:
			return (
				<div style={styles.label}>
					<p>{profile.data.skills.length}</p>
					<p>Skills</p>
				</div>
			);
		case TabTypes.Badges:
			return (
				<div style={styles.label}>
					<p>{profile.data.badges.filter(item => item.isUnlocked).length}</p>
					<p>Badges</p>
				</div>
			);
		case TabTypes.Activity:
			return (
				<div style={styles.label}>
					<FeedIcon color={grey600} />
					<p>Activity</p>
				</div>
			);
		default:
		}
	}

	handleTabChange = (value) => {
		this.setState({ activeTab: value });
		switch (value) {
		case TabTypes.Activity:
			browserHistory.replace(`/profile/${this.props.params.id}/activity`);
			break;
		case TabTypes.Codes:
			browserHistory.replace(`/profile/${this.props.params.id}/codes`);
			break;
		case TabTypes.Posts:
			browserHistory.replace(`/profile/${this.props.params.id}/posts`);
			break;
		case TabTypes.Skills:
			browserHistory.replace(`/profile/${this.props.params.id}/skills`);
			break;
		case TabTypes.Badges:
			browserHistory.replace(`/profile/${this.props.params.id}/badges`);
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

	selectTab = (tab) => {
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
			this.handleTabChange(TabTypes.Badges);
			break;
		default:
			browserHistory.replace(`/profile/${this.props.params.id}/activity`);
			this.handleTabChange(TabTypes.Activity);
			break;
		}
	}

	render() {
		const { profile, levels } = this.props;

		if (!this.props.isLoaded) {
			return (
				<LoadingOverlay />
			);
		}

		return (
			<div id="profile" style={styles.container}>
				<div className="cover" style={styles.cover} />
				<div style={styles.profileOverlay}>
					<Paper className="profile-overlay" style={styles.userInfo}>
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
					</Paper>
					{
						this.state.activeTab === TabTypes.Activity &&
						<div className="section" style={styles.section}>
							<FeedItemsBase
								isLoaded={profile.feed.length > 0}
								feed={profile.feed}
								feedPins={[]}
								isUserProfile
								userId={profile.data.id}
							/>
						</div>
					}
					{
						this.state.activeTab === TabTypes.Codes &&
						<div className="section" style={styles.section}>
							<Codes
								codes={profile.codes}
								isLoaded={profile.codes.length > 0}
								ordering={3}
								language=""
								query=""
								isUserProfile
								userId={profile.data.id}
							/>
						</div>
					}
					{
						this.state.activeTab === TabTypes.Posts &&
						<div className="section" style={styles.section}>
							<Questions
								questions={profile.posts}
								isLoaded={profile.posts.length > 0}
								ordering={7}
								query=""
								isUserProfile
								userId={profile.data.id}
							/>
						</div>
					}
					{this.state.activeTab === TabTypes.Skills &&
						<Skills profile={profile.data} levels={levels} skills={profile.data.skills} />}
					{this.state.activeTab === TabTypes.Badges &&
						<Badges badges={profile.data.badges} />}
					<Dialog
						modal={false}
						open={this.state.popupOpened}
						onRequestClose={this.handlePopupClose}
						style={styles.popupOverlay}
						bodyStyle={styles.popup}
					>
						<FollowersBase userId={profile.data.id} closePopup={this.handlePopupClose} />
					</Dialog>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'profile'),
	profile: state.profile,
	levels: state.levels,
});

const mapDispatchToProps = {
	getProfileFeedItems: getFeedItemsInternal,
	getProfileCodes: getCodesInternal,
	getProfileQuestions: getQuestionsInternal,
	getProfile: getProfileInternal,
	emptyProfileFollowers,
	clearOpenedProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
