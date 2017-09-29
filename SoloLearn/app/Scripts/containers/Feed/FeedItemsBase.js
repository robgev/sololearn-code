﻿//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import Scroll from 'react-scroll';
let scroll = Scroll.animateScroll;

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { getFeedItemsInternal, getPinnedFeedItemsInternal, getUserSuggestionsInternal, getNewFeedItemsInternal } from '../../actions/feed';
import { defaultsLoaded } from '../../reducers';

//Service
import Service from '../../api/service';

//Additional data and components
import Header from './Header';
import FeedPins from './FeedPins';
import FeedItem from './FeedItem';
import FeedItems from './FeedItems';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import Avatar from 'material-ui/Avatar';

//Utils and defaults
import PopupTypes from '../../defaults/feedPopupTypes';
import numberFormatter from '../../utils/numberFormatter';
import getSyles from '../../utils/styleConverter';
import getOffset from '../../utils/getOffset';

const styles = {

    subTitle: {
        textTransform: 'uppercase',
        fontSize: '14px',
        color: '#78909c',
        margin: '10px 0 0 0'
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
            zIndex: 10001
        },

        title: {
            display: 'inline-block',
            verticalAlign: 'middle',
        },

        icon: {
            display: 'inline-block',
            verticalAlign: 'middle',
            width: '20px',
            height: '20px'
        }
    },

    bottomLoading: {
        base: {
            position: 'relative',
            width: '100%',
            height: '50px',
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity ease 300ms, -webkit-transform ease 300ms'
        },

        active: {
            visibility: 'visible',
            opacity: 1,
            transform: 'translateY(0)'
        }
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
        }
    },

    popup: {
        padding: '10px 15px'
    },

    userDetails: {
        display: 'flex',
        alignItems: 'center',
        margin: '0 0 10px 0'
    },

    avatar: {
        margin: '0px 8px 0px 0'
    },

    userName: {
        fontSize: '14px',
        color: '#000',
        margin: '0 0 3px 0'
    },

    level: {
        fontSize: '12px'
    },

    userStatsWrapper: {
        display: 'flex',
        alignItems: 'center'
    },

    userStats: {
        flex: '2 auto',
        margin: '0 0 0 10px'
    },

    progress: {
        backgroundColor: '#dedede'
    },

    language: {
        width: '50px',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#607d8b',
        color: '#fff',
        fontSize: '13px'
    },

    progressData: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '2px 0 0 0'
    },

    progressText: {
        fontSize: '12px'
    },

    courseDetails: {
        display: 'flex',
        alignItems: 'center'
    },

    courseIcon: {
        width: '50px',
        margin: '0px 8px 0px 0'
    },

    courseInfo: {
        flex: '2 auto'
    },

    courseName: {
        fontSize: '14px',
        color: '#000',
        margin: '0 0 3px 0'
    },

    learnersCount: {
        fontSize: '12px',
        margin: '0 0 3px 0'
    },

    actions: {
        textAlign: 'right',
        margin: '10px 0 0 0'
    }
}

class FeedItemsBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            fullyLoaded: false,
            hasNewItems: false,
            popupOpened: false,
            totalWins: 0,
            totalLoses: 0
        }
        this.interval = null;
        this.popupData = {};
    }
    
    componentWillMount() {
        const { defaultsLoaded, isLoaded, isUserProfile } = this.props;
    
        if (!defaultsLoaded) {
            this.props.loadDefaults().then((response) => {
                if (!isLoaded) {
                    this.loadFeedItems(null).then(() => {
                        //this.interval = setInterval(() => { this.loadNewFeedItems() }, 30000);
                    });
                    !isUserProfile && this.props.getPinnedFeedItems(null, null, null);
                    !isUserProfile && this.props.getUserSuggestions();
                }
            }).catch((error) => {
                console.log(error);
            });
        }
        else if (!isLoaded) {
            this.loadFeedItems(null).then(() => {
                //this.interval = setInterval(() => { this.loadNewFeedItems() }, 30000);
            });
            !isUserProfile && this.props.getPinnedFeedItems(null, null, null);
            !isUserProfile && this.props.getUserSuggestions();
        }
        else {
            //this.interval = setInterval(() => { this.loadNewFeedItems() }, 30000);
        }
    }
    
    //Add event listeners after component mounts
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        //this.interval = setInterval(() => { this.loadNewFeedItems() }, 30000);
    }
    
    //Remove event listeners after component unmounts
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        //clearInterval(this.interval);
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
    loadFeedItems = (fromId) => {
        this.setState({ isLoading: true });

        return this.props.getFeedItems(fromId, this.props.userId).then(count => {
            if (count == 0) this.setState({ fullyLoaded: true });

            this.setState({ isLoading: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    //Check availability of new items above
    loadNewFeedItems = () => {
        const firstItem = this.props.feed[0];
        let fromId = !firstItem.groupedItems ? firstItem.toId : firstItem.id;

        this.props.getNewFeedItems(fromId, this.props.userId).then(count => {
            console.log(!this.state.hasNewItems && count > 0 && this.getScrollState());

            if (!this.state.hasNewItems && count > 0 && this.getScrollState()) {
                this.setState({ hasNewItems: true });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getScrollState = () => {
        const feedItems = document.getElementById("feed-items");
        const feedItemsOffset = getOffset(feedItems);

        return window.scrollY > feedItemsOffset.top;
    }

    //Get last feed item from feed
    getLastFeedItem = () => {
        const feedItems = this.props.feed;

        for (let i = feedItems.length - 1; i >= 0; i--) {
            if (feedItems[i].type > 0) {
                return feedItems[i];
            }
        }
    }

    //Handle window scroll
    handleScroll = () => {
        if (!this.getScrollState() && this.state.hasNewItems) {
            this.setState({ hasNewItems: false });
        }

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.isLoading && !this.state.fullyLoaded) {
                let lastItem = this.getLastFeedItem();
                this.loadFeedItems(lastItem.id);
            }
        }
    }

    //Scroll to top of the feed
    scrollToFeedItems = () => {
        const feedItems = document.getElementById("feed-items");
        const feedItemsOffset = getOffset(feedItems);

        let options = {
            duration: 700,
            smooth: true
        };

        scroll.scrollTo(feedItemsOffset.top - 30, options);
    }

    getChallengeStats = (userId, courseId) => {
        Service.request("Challenge/GetContestStats", { userId: userId, courseId: courseId })
            .then(response => {
                const stats = response.stats;

                this.setState({
                    totalWins: stats.totalWins,
                    totalLoses: stats.totalLoses
                });
            });
    }

    renderPopup = () => {
        const courses = this.props.courses;
        let courseIndex = courses.findIndex((course) => { return course.id == this.popupData.courseId });
        let course = courses[courseIndex];

        if (this.popupData.type == PopupTypes.course) {
            let hasProgress = false;

            const skills = this.props.userProfile.skills;
            let userCourseIndex = skills.findIndex((course) => { return course.id == this.popupData.courseId });
            let learners = course.learners;
            let alias = course.alias;

            if (userCourseIndex > 0) {
                course = skills[userCourseIndex];
                hasProgress = true;
            }

            return (
                <div className="popup-data">
                    <div style={styles.courseDetails} >
                        <img src={"https://www.sololearn.com/Icons/Courses/" + course.id + ".png"} alt={course.name} style={styles.courseIcon} />
                        <div style={styles.courseInfo}>
                            <p style={styles.courseName}>{course.name}</p>
                            <p style={styles.learnersCount}>{numberFormatter(learners, true)} Users</p>
                            {hasProgress && <LinearProgress style={styles.progress} mode="determinate" value={course.progress * 100} color="#8BC34A" />}
                        </div>

                    </div>
                    <div className="actions" style={styles.actions}>
                        <Link to={"/learn/" + alias}>
                            <FlatButton label="Open Course" primary={true} />
                        </Link>
                    </div>
                </div>
            );
        }
        else {
            this.getChallengeStats(this.popupData.userId, this.popupData.courseId);

            return (
                <div className="popup-data">
                    <div className="user-details" style={styles.userDetails}>
                        <Avatar size={45} style={styles.avatar}>{this.popupData.userName.charAt(0).toUpperCase()}</Avatar>
                        <div>
                            <p style={styles.userName}>{this.popupData.userName}</p>
                            <p style={styles.level}>LEVEL {this.popupData.level}</p>
                        </div>
                    </div>
                    <div className="user-stats" style={styles.userStatsWrapper}>
                        <div style={styles.language}>{course.language.toUpperCase()}</div>
                        <div className="progress-wrapper" style={styles.userStats}>
                            <LinearProgress style={styles.progress}
                                mode="determinate" min={0}
                                max={this.state.totalWins + this.state.totalLoses > 0 ? this.state.totalWins + this.state.totalLoses : 100}
                                value={this.state.totalWins} color="#8BC34A" />
                            <div style={styles.progressData}>
                                <span style={styles.progressText}>{this.state.totalWins} wins</span>
                                <span style={styles.progressText}>{this.state.totalLoses} loses</span>
                            </div>
                        </div>
                    </div>
                    <div className="actions" style={styles.actions}>
                        <Link to={"/profile/" + this.popupData.userId}>
                            <FlatButton label="Show profile" primary={true} />
                        </Link>
                        <Link to={"/play/"}>
                            <FlatButton label="Challenge" primary={true} />
                        </Link>
                    </div>
                </div>
            );
        }
    }

    handlePopupOpen = (data) => {
        this.popupData = data;
        this.setState({ popupOpened: true });
    }

    handlePopupClose = () => {
        this.setState({
            popupOpened: false,
            totalWins: 0,
            totalLoses: 0
        });

        this.popupData = {};
    }

    render() {
        const { feed, feedPins, userProfile, levels, isLoaded, defaultsLoaded, isUserProfile } = this.props;
        if ((!defaultsLoaded) && !isUserProfile) {
            return <LoadingOverlay />;
        }

        return (
            <div className="wrapper">
                {!isUserProfile && <Header profile={userProfile} levels={levels} />}
                <div>
                    {(!this.props.isLoaded && !this.state.fullyLoaded && !isUserProfile) && <LoadingOverlay />}
                    {
                        this.state.hasNewItems &&
                        <Motion defaultStyle={{ top: -30 }} style={{ top: spring(10, { stiffness: 250, damping: 26 }) }}>
                            {interpolatingStyle =>
                                <div className="new-activity-button" style={[styles.newActivityButton.wrapper, interpolatingStyle]} onClick={this.scrollToFeedItems}>
                                    <p style={styles.newActivityButton.title}>New Activity</p>
                                    <Arrow color="#fff" style={styles.newActivityButton.icon} />
                                </div>
                            }
                        </Motion>
                    }
                    {!isUserProfile && <p className="sub-title" style={styles.subTitle}>Activity Feed</p>}
                    {
                        (feedPins.length > 0 && !isUserProfile) &&

                        [<FeedPins pins={feedPins} openPopup={this.handlePopupOpen} key="feedPins" />,
                        <p className="sub-title" style={styles.subTitle} key="separator">Most Recent</p>]
                    }
                    {(isLoaded && feed.length > 0) && <FeedItems feedItems={feed} openPopup={this.handlePopupOpen} /> }
                    {
                        ((isUserProfile || feed.length > 0) && !this.state.fullyLoaded) &&
                        [<div className="loadMore" style={this.state.isLoading ? styles.loadMore.base : [styles.loadMore.base, styles.loadMore.active]} key="loadMore">
                            <FlatButton label="Load More" onClick={() => { this.loadFeedItems(this.getLastFeedItem().id) }} />
                        </div>,
                        <div className="loading" style={!this.state.isLoading ? styles.bottomLoading.base : [styles.bottomLoading.base, styles.bottomLoading.active]} key="loading">
                            <LoadingOverlay size={30} />
                        </div>]
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
        defaultsLoaded: defaultsLoaded(state),
        userProfile: state.userProfile,
        courses: state.courses,
        levels: state.levels
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults,
        getFeedItems: getFeedItemsInternal,
        getPinnedFeedItems: getPinnedFeedItemsInternal,
        getUserSuggestions: getUserSuggestionsInternal,
        getNewFeedItems: getNewFeedItemsInternal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(FeedItemsBase));