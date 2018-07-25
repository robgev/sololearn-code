// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';

// Additional data and components
import { toSeoFriendly } from 'utils';
import { voteFeedPostItem, voteFeedCommentItem, voteFeedCodeItem } from 'actions/feed';
import CourseCard from 'components/CourseCard';
import FeedItems from './FeedItems';
import FeedItemBase from './FeedItemBase';
import Badge from './FeedTemplates/Badge';
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import Code from './FeedTemplates/Code';
import Comment from './FeedTemplates/Comment';
import Challenge from './FeedTemplates/Challenge';
import FeedSuggestions from './FeedSuggestions';
import BottomToolbar from './FeedBottomToolbar';

// Utils and Defaults
import types from '../../defaults/appTypes';

const styles = {
	feedItemWrapper: {
		position: 'relative',
	},
	feedItem: {
		cursor: 'pointer',
		position: 'relative',
		padding: 15,
		marginBottom: 10,
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

const mapDispatchToProps = {
	voteFeedCommentItem,
	voteFeedPostItem,
	voteFeedCodeItem,
};

@connect(null, mapDispatchToProps)
@Radium
class FeedItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpened: false,
		};
		this.votes = null;
		this.url = '';
	}

	handleChallengesOpen = () => {
		this.setState({ isOpened: !this.state.isOpened });
	}

	renderFeedItem = () => {
		const {
			feedItem,
			voteFeedPostItem,
			voteFeedCodeItem,
			voteFeedCommentItem,
		} = this.props;
		switch (feedItem.type) {
		case types.badgeUnlocked:
			this.url = `/profile/${feedItem.user.id}/badges/${feedItem.achievement.id}`;
			return <Badge achievement={feedItem.achievement} />;
		case types.courseStarted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.name, 100)}/${feedItem.course.id}/1`;
			return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
		case types.courseCompleted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.name, 100)}/${feedItem.course.id}/1`;
			return <Course course={feedItem.course} openPopup={this.props.openPopup} />;
		case types.postedQuestion:
			this.url = `/discuss/${feedItem.post.id}`;
			this.votes = feedItem.post.votes;
			return (
				<Post
					isQuestion
					url={this.url}
					date={feedItem.date}
					post={feedItem.post}
					vote={feedItem.vote}
					votes={feedItem.votes}
					onUpvote={() => voteFeedPostItem(feedItem, 1)}
					onDownvote={() => voteFeedPostItem(feedItem, -1)}
				/>
			);
		case types.postedAnswer:
			this.url = `/discuss/${feedItem.post.parentID}/answer/${feedItem.post.id}`;
			this.votes = feedItem.post.votes;
			return (
				<Post
					url={this.url}
					isQuestion={false}
					post={feedItem.post}
					vote={feedItem.vote}
					date={feedItem.date}
					votes={feedItem.votes}
					onUpvote={() => voteFeedPostItem(feedItem, 1)}
					onDownvote={() => voteFeedPostItem(feedItem, -1)}
				/>
			);
		case types.postedCode:
		case types.upvoteCode:
			this.url = `/playground/${feedItem.code.publicID}`;
			this.votes = feedItem.code.votes;
			return (
				<div>
					<Code code={feedItem.code} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedCodeItem(feedItem, 1)}
						onDownvote={() => voteFeedCodeItem(feedItem, -1)}
					/>
				</div>
			);
		case types.completedChallange:
			this.url = `/profile/${feedItem.contest.player.id}`;
			return <Challenge contest={feedItem.contest} />;
		case types.suggestions:
			return <FeedSuggestions feedItem={feedItem} />;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			// this.url = `/learn/${feedItem.course.alias}/${feedItem.course.id}`;
			this.url = `/learn/${toSeoFriendly(feedItem.course.name, 100)}/${feedItem.course.id}?commentID=${feedItem.comment.id}`;
			return (
				<div>
					<Comment url={this.url} comment={feedItem.comment} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedCommentItem(feedItem, 1)}
						onDownvote={() => voteFeedCommentItem(feedItem, -1)}
					/>
				</div>
			);
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
			this.url = `/learn/slayLesson/2/${feedItem.userLesson.id}/1?commentID=${feedItem.comment.id}`;
			return (
				<div>
					<Comment url={this.url} comment={feedItem.comment} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedCommentItem(feedItem, 1)}
						onDownvote={() => voteFeedCommentItem(feedItem, -1)}
					/>
				</div>
			);
		case types.postedCodeComment:
		case types.postedCodeCommentReply:
		case types.upvoteCodeComment:
			this.url = `/playground/${feedItem.code.publicID}?commentID=${feedItem.comment.id}`;
			return (
				<div>
					<Comment url={this.url} comment={feedItem.comment} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedCommentItem(feedItem, 1)}
						onDownvote={() => voteFeedCommentItem(feedItem, -1)}
					/>
				</div>
			);
		case types.lessonCreated:
			this.url = `/learn/slayLesson/2/${feedItem.userLesson.id}/1`;
			return (
				<CourseCard
					itemType={2}
					id={feedItem.userLesson.id}
					name={feedItem.userLesson.name}
					color={feedItem.userLesson.color}
					userID={feedItem.userLesson.userID}
					iconUrl={feedItem.userLesson.iconUrl}
					viewCount={feedItem.userLesson.viewCount}
					comments={feedItem.userLesson.comments}
				/>
			);
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
						zDepth={1}
						style={styles.feedItem}
						onClick={this.handleChallengesOpen}
					>
						<FeedItemBase
							feedItemId={feedItem.id}
							title={feedItem.title}
							user={feedItem.user}
							date={feedItem.date}
							votes={this.votes}
						/>
					</Paper>
					<FeedItems
						feedItems={feedItem.groupedItems}
						className={`merged-items-container ${this.state.isOpened ? 'open' : ''}`}
						style={{ height: this.state.isOpened ? feedItem.groupedItems.length * 143 : 0 }}
					/>
				</div>
			);
		}
		return (
			<div style={styles.feedItemWrapper}>
				<Paper zDepth={1} style={styles.feedItem}>
					<FeedItemBase
						feedItemId={feedItem.id}
						title={feedItem.title}
						user={feedItem.user}
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

export default FeedItem;