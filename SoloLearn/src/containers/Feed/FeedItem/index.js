// React modules
import React, { Component } from 'react';
import { observer } from 'mobx-react';

// Additional data and components
import { toSeoFriendly } from 'utils';
import { CourseCard } from 'containers/Learn/components';
import { Container } from 'components/atoms';
import { MoreItemsIndicator } from 'components/molecules';
import types from 'defaults/appTypes';

import FeedItemBase from '../FeedItemBase';
import Badge from '../FeedTemplates/Badge';
import Course from '../FeedTemplates/Course';
import Post from '../FeedTemplates/Post';
import Code from '../FeedTemplates/Code';
import Comment from '../FeedTemplates/Comment';
import Challenge from '../FeedTemplates/Challenge';
import UserPost from '../FeedTemplates/UserPost';
import Achievement from '../FeedTemplates/Achievement';
import FeedSuggestions from '../FeedSuggestions';

import './styles.scss';

@observer
class FeedItem extends Component {
	constructor(props) {
		super(props);
		this.votes = null;
		this.url = '';
	}

	handleChallengesOpen = () => {
		const {
			open,
			measure,
			openItem,
			closeItem,
			feedItem: { id },
		} = this.props;
		if (open) {
			closeItem(id, measure);
		} else {
			openItem(id, measure);
		}
	}

	componentDidMount() {
		if (this.props.updatePosition) {
			this.props.updatePosition();
		}
	}

	renderFeedItem = () => {
		const {
			feedItem,
			voteFeedItem,
		} = this.props;
		switch (feedItem.type) {
		case types.badgeUnlocked:
			this.url = `/profile/${feedItem.user.id}/badges?badgeID=${feedItem.achievement.id}`;
			return <Badge date={feedItem.date} achievement={feedItem.achievement} url={this.url} />;
		case types.courseStarted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.alias)}`;
			return <Course date={feedItem.date} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
		case types.courseCompleted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.alias)}`;
			return <Course date={feedItem.date} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
		case types.postedQuestion:
			this.url = `/discuss/${feedItem.post.id}`;
			this.votes = feedItem.post.votes;
			return (
				<Post
					isQuestion
					url={this.url}
					date={feedItem.date}
					post={feedItem.post}
					id={feedItem.post.id}
					vote={feedItem.vote}
					votes={feedItem.votes}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.post.id })}
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
					id={feedItem.post.id}
					vote={feedItem.vote}
					date={feedItem.date}
					votes={feedItem.votes}
					onChange={({ vote: newVote }) => { voteFeedItem({ ...feedItem, newVote, targetId: feedItem.post.id }); }}
				/>
			);
		case types.postedCode:
		case types.upvoteCode:
			this.url = `/playground/${feedItem.code.publicID}`;
			this.votes = feedItem.code.votes;
			return (
				<Code
					code={feedItem.code}
					date={feedItem.date}
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.code.id })}
				/>
			);
		case types.completedChallange:
			this.url = `/profile/${feedItem.contest.player.id}`;
			return <Challenge date={feedItem.date} contest={feedItem.contest} language={feedItem.course.languageName} />;
		case types.suggestions:
			return <FeedSuggestions number={feedItem.number} />;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			this.url = `/learn/${toSeoFriendly(feedItem.course.alias)}?commentID=${feedItem.comment.id}`;
			return (
				<Comment
					url={this.url}
					comment={feedItem.comment}
					date={feedItem.date}
					type="lessonComment"
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
				/>
			);
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
			this.url = `/learn/${feedItem.userLesson.id}/${toSeoFriendly(feedItem.userLesson.name, 100)}/1?commentID=${feedItem.comment.id}`;
			return (
				<Comment
					url={this.url}
					comment={feedItem.comment}
					date={feedItem.date}
					type="userLessonComment"
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
				/>
			);
		case types.postedCodeComment:
		case types.postedCodeCommentReply:
		case types.upvoteCodeComment:
			this.url = `/playground/${feedItem.code.publicID}?commentID=${feedItem.comment.id}`;
			return (
				<Comment
					url={this.url}
					comment={feedItem.comment}
					date={feedItem.date}
					type="codeComment"
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
				/>
			);
		case types.lessonCreated:
			this.url = `/learn/${feedItem.userLesson.id}/${toSeoFriendly(feedItem.userLesson.name, 100)}/1`;
			return (
				<Container>
					<CourseCard
						small
						itemType={2}
						className="course-card"
						id={feedItem.userLesson.id}
						name={feedItem.userLesson.name}
						color={feedItem.userLesson.color}
						userID={feedItem.userLesson.userID}
						iconUrl={feedItem.userLesson.iconUrl}
						viewCount={feedItem.userLesson.viewCount}
						comments={feedItem.userLesson.comments}
					/>
				</Container>
			);
		case types.userPost:
			return (
				<UserPost
					key={feedItem.id}
					user={feedItem.user}
					background={feedItem.userPost.background}
					message={feedItem.userPost.message}
					imageUrl={feedItem.userPost.imageUrl}
					date={feedItem.date}
					id={feedItem.userPost.id}
					vote={feedItem.vote}
					votes={feedItem.votes}
					measure={this.props.measure}
					userPostId={feedItem.userPost.id}
					comments={feedItem.userPost.comments}
					views={feedItem.userPost.viewCount}
					onChange={({ vote: newVote }) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.userPost.id })}
				/>
			);
		case types.leveledUp:
		case types.joined:
			return (
				<Achievement
					user={feedItem.user}
					title={feedItem.title}
					measure={this.props.measure}
					isLevelUp={feedItem.type === types.leveledUp}
				/>
			);
		default:
			return null;
		}
	}

	render() {
		const { feedItem, style } = this.props;
		// Render only suggestions
		if (feedItem.type === types.suggestions) {
			return (
				<Container style={style}>
					{this.renderFeedItem()}
				</Container>
			);
		} else if (feedItem.type === types.mergedChallange) {
			const groupedItems = this.props.open
				? feedItem.groupedItems
				: feedItem.groupedItems.slice(0, 2);
			const { length: itemCount } = feedItem.groupedItems;
			return (
				<Container style={style} className="feedItemWrapper">
					<Container
						className="feedItem"
					>
						<FeedItemBase
							feedItemId={feedItem.id}
							title={feedItem.title}
							user={feedItem.user}
							date={feedItem.date}
							votes={this.votes}
							hideTitle
						>
							<Container
								id="feed-items"
								className="merged-items-container"
							>
								{groupedItems.map(currentItem => (
									<Container
										key={currentItem.type === types.mergedChallange ?
											`feedGroup${currentItem.toId}` :
											`feedItem${currentItem.id}`}
										className="feedItemWrapper"
									>
										<Challenge
											merged
											date={currentItem.date}
											contest={currentItem.contest}
											language={currentItem.course.languageName}
										/>
									</Container>
								))}
							</Container>
							<MoreItemsIndicator
								open={this.props.open}
								condition={itemCount > 2}
								onClick={this.handleChallengesOpen}
								className="merged-challenges-indicator"
								closedText={`${itemCount - 2} more challenges`}
							/>
						</FeedItemBase>
					</Container>
				</Container>
			);
		}
		const isAchievement =
			feedItem.type === types.leveledUp ||
			feedItem.type === types.joined;
		const isChallenge = feedItem.type === types.completedChallange;
		return (
			<Container style={style} className="feedItemWrapper">
				<Container className="feedItem">
					<FeedItemBase
						feedItemId={feedItem.id}
						title={feedItem.title}
						user={feedItem.user}
						votes={this.votes}
						date={feedItem.date}
						hideTitle={isChallenge || isAchievement}
					>
						{this.renderFeedItem()}
					</FeedItemBase>
				</Container>

			</Container>
		);
	}
}

export default FeedItem;
