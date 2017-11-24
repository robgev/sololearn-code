// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';

// Additional data and components
import FeedItems from './FeedItems';
import FeedItemBase from './FeedItemBase';
import Badge from './FeedTemplates/Badge';
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import Code from './FeedTemplates/Code';
import Challenge from './FeedTemplates/Challenge';
import FeedSuggestions from './FeedSuggestions';

// Utils and Defaults
import types from '../../defaults/appTypes';

const styles = {
	feedItemWrapper: {
		position: 'relative',
	},
	feedItem: {
		position: 'relative',
		padding: '10px',
		margin: '10px 0px',
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
		zIndex: 1,
	},
};

class FeedItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpened: false,
		};
		this.votes = null;
		this.url = '';
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.props.feedItem !== nextProps.feedItem ||
			this.state.isOpened !== nextState.isOpened);
	}

	handleChallengesOpen = () => {
		this.setState({ isOpened: !this.state.isOpened });
	}

	renderFeedItem = () => {
		const { feedItem } = this.props;
		switch (feedItem.type) {
		case types.badgeUnlocked:
			this.url = '/profile/badges';
			return <Badge achievement={feedItem.achievement} />;
		case types.courseStarted:
			this.url = `/learn/${feedItem.course.alias}`;
			return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
		case types.courseCompleted:
			this.url = `/learn/${feedItem.course.alias}`;
			return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
		case types.postedQuestion:
			this.url = `/discuss/${feedItem.post.id}`;
			this.votes = feedItem.post.votes;
			return <Post post={feedItem.post} isQuestion url={this.url} />;
		case types.postedAnswer:
			this.url = `/discuss/${feedItem.post.parentID}/answer/${feedItem.post.id}`;
			this.votes = feedItem.post.votes;
			return <Post post={feedItem.post} isQuestion={false} url={this.url} />;
		case types.postedCode:
			this.url = `/playground/${feedItem.code.publicID}`;
			this.votes = feedItem.code.votes;
			return <Code code={feedItem.code} />;
		case types.completedChallange:
			this.url = `/profile/${feedItem.contest.player.id}`;
			return <Challenge contest={feedItem.contest} openPopup={this.props.openPopup} />;
		case types.suggestions:
			return <FeedSuggestions suggestions={feedItem.suggestions} />;
		default:
			return null;
		}
	}

	render() {
		const { feedItem } = this.props;

		// Render only suggestions
		if (feedItem.type === types.suggestions) {
			return (
				<div>
					{this.renderFeedItem()}
				</div>
			);
		} else if (feedItem.type === types.mergedChallange) {
			return (
				<div>
					<Paper
						style={styles.feedItem}
						onClick={this.handleChallengesOpen}
					>
						<FeedItemBase
							title={feedItem.title}
							user={feedItem.user}
							date={feedItem.date}
							votes={this.votes}
						/>
					</Paper>
					{this.state.isOpened &&
						<FeedItems
							feedItems={feedItem.groupedItems}
							openPopup={this.props.openPopup}
						/>}
				</div>
			);
		}
		return (
			<div style={styles.feedItemWrapper}>
				<Paper style={styles.feedItem}>
					<FeedItemBase
						title={feedItem.title}
						user={feedItem.user}
						date={feedItem.date}
						votes={this.votes}
					>
						{this.renderFeedItem()}
					</FeedItemBase>
				</Paper>
				<Link
					to={this.url}
					style={styles.linkStyle}
				/>
			</div>
		);
	}
}

export default Radium(FeedItem);
