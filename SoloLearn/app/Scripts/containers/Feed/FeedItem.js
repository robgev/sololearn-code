//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';

//Additional data and components
import FeedItems from './FeedItems';
import FeedItemBase from './FeedItemBase';
import Badge from './FeedTemplates/Badge';
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import Code from './FeedTemplates/Code';
import Challenge from './FeedTemplates/Challenge';
import FeedSuggestions from './FeedSuggestions';

//Material UI components
import Paper from 'material-ui/Paper';

//Utils and Defaults
import getLanguageColor from '../../utils/getLanguageColor';
import types from '../../defaults/appTypes';

const styles = {
    feedItemWrapper: {
        position: 'relative'
    },

    feedItem: {
        position: 'relative',
        padding: '10px',
        margin: '10px 0px'
    },

    linkStyle: {
        display: 'block',
        textDecoration: 'none',
        color: '#000',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
    },
}

class FeedItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpened: false
        }

        this.votes = null;
        this.url = "";

        this.handleChallengesOpen = this.handleChallengesOpen.bind(this);
    }

    handleChallengesOpen() {
        this.setState({ isOpened: !this.state.isOpened })
    }

    renderFeedItem() {
        const feedItem = this.props.feedItem;

        switch (feedItem.type) {
            case types.badgeUnlocked:
                this.url = "/profile/badges";
                return <Badge achievement={feedItem.achievement} />;
            case types.courseStarted:
                this.url = "/learn/" + feedItem.course.alias;
                return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
            case types.courseCompleted:
                this.url = "/learn/" + feedItem.course.alias;
                return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
            case types.postedQuestion:
                this.url = "/discuss/" + feedItem.post.id;
                this.votes = feedItem.post.votes;
                return <Post post={feedItem.post} isQuestion={true} />;
            case types.postedAnswer:
                this.url = "/discuss/" + feedItem.post.parentID;
                this.votes = feedItem.post.votes;
                return <Post post={feedItem.post} isQuestion={false} />;
            case types.postedCode:
                this.url = "/playground/" + feedItem.code.publicID;
                this.votes = feedItem.code.votes;
                return <Code code={feedItem.code} />;
            case types.completedChallange: 
                this.url = "/profile/" + feedItem.contest.player.id;
                return <Challenge contest={feedItem.contest} openPopup={this.props.openPopup} />;
            case types.suggestions:
                return <FeedSuggestions suggestions={feedItem.suggestions} />;
        }
    }

    render() {
        const feedItem = this.props.feedItem;
        let feedContent = null;

        //Render only suggestions
        if (feedItem.type == types.suggestions) {
            feedContent = this.renderFeedItem();

            return (
                <div>
                    {feedContent}
                </div>
            );
        }
        //Render only merged challanges
        else if (feedItem.type == types.mergedChallange) {
            return (
                <div>
                    <Paper className="feed-item" style={styles.feedItem} onClick={this.handleChallengesOpen}>
                        <FeedItemBase title={feedItem.title} user={feedItem.user} date={feedItem.date} votes={this.votes} />
                    </Paper>
                    {this.state.isOpened && <FeedItems feedItems={feedItem.groupedItems} openPopup={this.props.openPopup} />}
                </div>
            );
        }
        //Render all types except two above
        else {
            feedContent = this.renderFeedItem();

            return (
                <div style={styles.feedItemWrapper}>
                    <Paper className="feed-item" style={styles.feedItem}>
                        <FeedItemBase title={feedItem.title} user={feedItem.user} date={feedItem.date} votes={this.votes}>
                            {feedContent}
                        </FeedItemBase>
                    </Paper>
                    <Link to={this.url} style={styles.linkStyle}></Link>
                </div>
            );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.feedItem !== nextProps.feedItem || this.state.isOpened != nextState.isOpened);
    }
}

export default Radium(FeedItem);