// React modules
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';

// Material UI components
import Paper from 'material-ui/Paper';

// Additional data and components
import { updateDate, toSeoFriendly } from 'utils';
import CourseCard from 'components/CourseCard';
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
@observer
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
			voteFeedItem,
		} = this.props;
		switch (feedItem.type) {
		case types.badgeUnlocked:
			this.url = `/profile/${feedItem.user.id}/badges?badgeID=${feedItem.achievement.id}`;
			return <Badge date={updateDate(feedItem.date)} achievement={feedItem.achievement} />;
		case types.courseStarted:
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}`;
			return <Course date={updateDate(feedItem.date)} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
		case types.courseCompleted:
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}`;
			return <Course date={updateDate(feedItem.date)} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
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
					onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.post.id })}
					onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.post.id })}
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
					onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.post.id })}
					onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.post.id })}
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
						onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.code.id })}
						onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.code.id })}
					/>
				</div>
			);
		case types.completedChallange:
			this.url = `/profile/${feedItem.contest.player.id}`;
			return <Challenge date={updateDate(feedItem.date)} contest={feedItem.contest} />;
		case types.suggestions:
			return <FeedSuggestions number={feedItem.number} />;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			// this.url = `/learn/${feedItem.course.alias}/${feedItem.course.id}`;
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}?commentID=${feedItem.comment.id}`;
			return (
				<div>
					<Comment url={this.url} comment={feedItem.comment} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.comment.id })}
						onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.comment.id })}
					/>
				</div>
			);
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
			this.url = `/learn/lesson/${feedItem.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${feedItem.userLesson.id}/${feedItem.userLesson.name}/1?commentID=${feedItem.comment.id}`;
			return (
				<div>
					<Comment url={this.url} comment={feedItem.comment} />
					<BottomToolbar
						date={feedItem.date}
						userVote={feedItem.vote}
						totalVotes={feedItem.votes}
						onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.comment.id })}
						onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.comment.id })}
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
						onUpvote={() => voteFeedItem({ ...feedItem, newVote: 1, targetId: feedItem.comment.id })}
						onDownvote={() => voteFeedItem({ ...feedItem, newVote: -1, targetId: feedItem.comment.id })}
					/>
				</div>
			);
		case types.lessonCreated:
			this.url = `/learn/lesson/${feedItem.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${feedItem.userLesson.id}/${feedItem.userLesson.name}/1`;
			return (
				<Fragment>
					<CourseCard
						small
						itemType={2}
						style={{ boxShadow: 'none' }}
						id={feedItem.userLesson.id}
						name={feedItem.userLesson.name}
						color={feedItem.userLesson.color}
						userID={feedItem.userLesson.userID}
						iconUrl={feedItem.userLesson.iconUrl}
						viewCount={feedItem.userLesson.viewCount}
						comments={feedItem.userLesson.comments}
					/>
					<div className="feed-date-container">
						<p className="date">{updateDate(feedItem.date)}</p>
					</div>
				</Fragment>
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
						<div className="feed-date-container">
							<p className="date">{updateDate(feedItem.date)}</p>
						</div>
					</Paper>
					<div
						id="feed-items"
						className={`merged-items-container ${this.state.isOpened ? 'open' : ''}`}
						style={{ height: this.state.isOpened ? feedItem.groupedItems.length * 159 : 0 }}
					>
						{feedItem.groupedItems.map(currentItem => (
							<FeedItem
								key={currentItem.type === types.mergedChallange ?
									`feedGroup${currentItem.toId}` :
									`feedItem${currentItem.id}`}
								feedItem={currentItem}
								openCoursePopup={this.props.openCoursePopup}
							/>
						))}
					</div>
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
