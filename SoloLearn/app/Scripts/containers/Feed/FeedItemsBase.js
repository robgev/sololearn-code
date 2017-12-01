// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import Scroll from 'react-scroll';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

// Material UI components
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

// Redux modules
import {
	getFeedItemsInternal,
	getNewFeedItemsInternal,
	getUserSuggestionsInternal,
	getPinnedFeedItemsInternal,
} from 'actions/feed';

// Service
import Service from 'api/service';

// Utils and defaults
import { getOffset, numberFormatter } from 'utils';
import PopupTypes from 'defaults/feedPopupTypes';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

// Additional data and components
import Header from './Header';
import FeedPins from './FeedPins';
import FeedItems from './FeedItems';

const scroll = Scroll.animateScroll;

const styles = {
	subTitle: {
		textTransform: 'uppercase',
		fontSize: '14px',
		color: '#78909c',
		margin: '10px 0 0 0',
	},
	newActivityButton: {
		wrapper: {
			width: '100px',
			position: 'fixed',
			left: '50%',
			margin: '0 0 0 -50px',
			textAlign: 'center',
			fontSize: '13px',
			backgroundColor: '#78909c',
			color: '#fff',
			borderRadius: '18px',
			padding: '3px 5px 3px 15px',
			cursor: 'pointer',
			zIndex: 10001,
		},
		title: {
			display: 'inline-block',
			verticalAlign: 'middle',
		},
		icon: {
			display: 'inline-block',
			verticalAlign: 'middle',
			width: '20px',
			height: '20px',
		},
	},
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},
		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},
	loadMore: {
		base: {
			textAlign: 'center',
			width: '100%',
			visibility: 'hidden',
			opacity: 0,
		},
		active: {
			visibility: 'visible',
			opacity: 1,
		},
	},
	popup: {
		padding: '10px 15px',
	},
	userDetails: {
		display: 'flex',
		alignItems: 'center',
		margin: '0 0 10px 0',
	},
	avatar: {
		margin: '0px 8px 0px 0',
	},
	userName: {
		fontSize: '14px',
		color: '#000',
		margin: '0 0 3px 0',
	},
	level: {
		fontSize: '12px',
	},
	userStatsWrapper: {
		display: 'flex',
		alignItems: 'center',
	},
	userStats: {
		flex: '2 auto',
		margin: '0 0 0 10px',
	},
	progress: {
		backgroundColor: '#dedede',
	},
	language: {
		width: '50px',
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#607d8b',
		color: '#fff',
		fontSize: '13px',
	},
	progressData: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		margin: '2px 0 0 0',
	},
	progressText: {
		fontSize: '12px',
	},
	courseDetails: {
		display: 'flex',
		alignItems: 'center',
	},
	courseIcon: {
		width: '50px',
		margin: '0px 8px 0px 0',
	},
	courseInfo: {
		flex: '2 auto',
	},
	courseName: {
		fontSize: '14px',
		color: '#000',
		margin: '0 0 3px 0',
	},
	learnersCount: {
		fontSize: '12px',
		margin: '0 0 3px 0',
	},
	actions: {
		textAlign: 'right',
		margin: '10px 0 0 0',
	},
};

class FeedItemsBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			fullyLoaded: false,
			hasNewItems: false,
			popupOpened: false,
			totalWins: 0,
			totalLoses: 0,
		};
		this.interval = null;
		this.popupData = {};
	}

	componentWillMount() {
		const { isLoaded, isUserProfile } = this.props;
		if (!isLoaded) {
			this.loadFeedItems(null);
			if (!isUserProfile) {
				this.props.getPinnedFeedItems(null, null, null);
				this.props.getUserSuggestions();
			}
		}
	}

	// Add event listeners after component mounts
	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.feed !== nextProps.feed
			|| this.props.feedPins !== nextProps.feedPins
			|| this.state.hasNewItems !== nextState.hasNewItems
			|| this.state.isLoading !== nextState.isLoading
			|| this.state.popupOpened !== nextState.popupOpened
			|| this.state.totalWins !== nextState.totalWins
			|| this.state.totalLoses !== nextState.totalLoses);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	loadFeedItems = async (fromId) => {
		this.setState({ isLoading: true });
		// try {
		const count = await this.props.getFeedItems(fromId, this.props.userId);
		if (count === 0) this.setState({ fullyLoaded: true });
		this.setState({ isLoading: false });
		// } catch (e) {
		// 	console.log(e);
		// }
	}

	// Check availability of new items above
	loadNewFeedItems = async () => {
		const firstItem = this.props.feed[0];
		const fromId = !firstItem.groupedItems ? firstItem.toId : firstItem.id;
		try {
			const count = await this.props.getNewFeedItems(fromId, this.props.userId);
			console.log(!this.state.hasNewItems && count > 0 && this.getScrollState());
			if (!this.state.hasNewItems && count > 0 && this.getScrollState()) {
				this.setState({ hasNewItems: true });
			}
		} catch (e) {
			console.log(e);
		}
	}

	getScrollState = () => {
		const feedItems = document.getElementById('feed-items');
		const feedItemsOffset = getOffset(feedItems);
		return window.scrollY > feedItemsOffset.top;
	}

	// Get last feed item from feed
	getLastFeedItem = () => {
		const { feed } = this.props;

		for (let i = feed.length - 1; i >= 0; i--) {
			if (feed[i].type > 0) {
				return feed[i];
			}
		}
	}

	// Handle window scroll
	handleScroll = () => {
		if (!this.getScrollState() && this.state.hasNewItems) {
			this.setState({ hasNewItems: false });
		}

		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				const lastItem = this.getLastFeedItem();
				this.loadFeedItems(lastItem.id);
			}
		}
	}

	// Scroll to top of the feed
	scrollToFeedItems = () => {
		const feedItems = document.getElementById('feed-items');
		const feedItemsOffset = getOffset(feedItems);

		const options = {
			duration: 700,
			smooth: true,
		};

		scroll.scrollTo(feedItemsOffset.top - 30, options);
	}

	getChallengeStats = async (userId, courseId) => {
		const { stats: { totalWins, totalLoses } } = Service.request('Challenge/GetContestStats', { userId, courseId });
		this.setState({ totalWins, totalLoses });
	}

	renderPopup = () => {
		const { courses } = this.props;
		const courseIndex = courses.findIndex(course => course.id === this.popupData.courseId);
		let course = courses[courseIndex];

		if (this.popupData.type === PopupTypes.course) {
			let hasProgress = false;
			const { skills } = this.props.userProfile;
			const userCourseIndex = skills.findIndex(curr => curr.id === this.popupData.courseId);
			const { learners, alias } = course;
			if (userCourseIndex > 0) {
				course = skills[userCourseIndex];
				hasProgress = true;
			}
			return (
				<div className="popup-data">
					<div style={styles.courseDetails} >
						<img
							src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`}
							alt={course.name}
							style={styles.courseIcon}
						/>
						<div style={styles.courseInfo}>
							<p style={styles.courseName}>{course.name}</p>
							<p style={styles.learnersCount}>{numberFormatter(learners, true)} Users</p>
							{hasProgress &&
								<LinearProgress
									style={styles.progress}
									mode="determinate"
									value={course.progress * 100}
									color="#8BC34A"
								/>}
						</div>
					</div>
					<div className="actions" style={styles.actions}>
						<Link to={`/learn/${alias}`}>
							<FlatButton label="Open Course" primary />
						</Link>
					</div>
				</div>
			);
		}

		this.getChallengeStats(this.popupData.userId, this.popupData.courseId);

		return (
			<div className="popup-data">
				<div className="user-details" style={styles.userDetails}>
					<ProfileAvatar
						size={40}
						userID={this.popupData.userId}
						userName={this.popupData.userName}
						avatarUrl={this.popupData.avatarUrl}
					/>
					<div>
						<p style={styles.userName}>{this.popupData.userName}</p>
						<p style={styles.level}>LEVEL {this.popupData.level}</p>
					</div>
				</div>
				<div className="user-stats" style={styles.userStatsWrapper}>
					<div style={styles.language}>{course.language.toUpperCase()}</div>
					<div className="progress-wrapper" style={styles.userStats}>
						<LinearProgress
							style={styles.progress}
							mode="determinate"
							min={0}
							max={this.state.totalWins + this.state.totalLoses > 0 ?
								this.state.totalWins + this.state.totalLoses :
								100}
							value={this.state.totalWins}
							color="#8BC34A"
						/>
						<div style={styles.progressData}>
							<span style={styles.progressText}>{this.state.totalWins} wins</span>
							<span style={styles.progressText}>{this.state.totalLoses} loses</span>
						</div>
					</div>
				</div>
				<div className="actions" style={styles.actions}>
					<Link to={`/profile/${this.popupData.userId}`}>
						<FlatButton label="Show profile" primary />
					</Link>
					<Link to="/play/">
						<FlatButton label="Challenge" primary />
					</Link>
				</div>
			</div>
		);
	}

	handlePopupOpen = (data) => {
		this.popupData = data;
		this.setState({ popupOpened: true });
	}

	handlePopupClose = () => {
		this.setState({
			popupOpened: false,
			totalWins: 0,
			totalLoses: 0,
		});

		this.popupData = {};
	}

	render() {
		const {
			feed, feedPins, userProfile, levels, isLoaded, isUserProfile,
		} = this.props;
		return (
			<div className="wrapper">
				{!isUserProfile && <Header profile={userProfile} levels={levels} />}
				<div>
					{(!this.props.isLoaded && !this.state.fullyLoaded && !isUserProfile) &&
						<LoadingOverlay />}
					{
						this.state.hasNewItems &&
						<Motion
							defaultStyle={{ top: -30 }}
							style={{ top: spring(10, { stiffness: 250, damping: 26 }) }}
						>
							{interpolatingStyle =>
								(
									<div
										className="new-activity-button"
										style={[ styles.newActivityButton.wrapper, interpolatingStyle ]}
										onClick={this.scrollToFeedItems}
									>
										<p style={styles.newActivityButton.title}>New Activity</p>
										<Arrow color="#fff" style={styles.newActivityButton.icon} />
									</div>
								)
							}
						</Motion>
					}
					{!isUserProfile && <p className="sub-title" style={styles.subTitle}>Activity Feed</p>}
					{
						(feedPins.length > 0 && !isUserProfile) &&

						[ <FeedPins pins={feedPins} openPopup={this.handlePopupOpen} key="feedPins" />,
							<p className="sub-title" style={styles.subTitle} key="separator">Most Recent</p> ]
					}
					{(isLoaded && feed.length > 0) &&
						<FeedItems feedItems={feed} openPopup={this.handlePopupOpen} />}
					{
						((isUserProfile || feed.length > 0) && !this.state.fullyLoaded) &&
						[
							<div
								key="loadMore"
								style={this.state.isLoading ?
									styles.loadMore.base :
									[ styles.loadMore.base, styles.loadMore.active ]}
							>
								<FlatButton
									label="Load More"
									onClick={() => { this.loadFeedItems(this.getLastFeedItem().id); }}
								/>
							</div>,
							<div
								key="loading"
								style={!this.state.isLoading ?
									styles.bottomLoading.base :
									[ styles.bottomLoading.base, styles.bottomLoading.active ]}
							>
								<LoadingOverlay size={30} />
							</div>,
						]
					}
					{
						this.state.popupOpened &&
						<Dialog
							modal={false}
							open={this.state.popupOpened}
							onRequestClose={this.handlePopupClose}
							bodyStyle={styles.popup}
						>
							{this.renderPopup()}
						</Dialog>
					}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		userProfile: state.userProfile,
		courses: state.courses,
		levels: state.levels,
	};
}

const mapDispatchToProps = {
	getFeedItems: getFeedItemsInternal,
	getPinnedFeedItems: getPinnedFeedItemsInternal,
	getUserSuggestions: getUserSuggestionsInternal,
	getNewFeedItems: getNewFeedItemsInternal,
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(FeedItemsBase));
