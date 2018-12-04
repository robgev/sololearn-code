// React modules
import React, { Component } from 'react';
import { observer } from 'mobx-react';

// Additional data and components
import { updateDate, toSeoFriendly } from 'utils';
import { CourseCard } from 'containers/Learn/components';
import {
	Container,
	PaperContainer,
} from 'components/atoms';
import types from 'defaults/appTypes';

import 'styles/Feed/FeedItem.scss';

import FeedItemBase from './FeedItemBase';
import Badge from './FeedTemplates/Badge';
import Course from './FeedTemplates/Course';
import Post from './FeedTemplates/Post';
import Code from './FeedTemplates/Code';
import Comment from './FeedTemplates/Comment';
import Challenge from './FeedTemplates/Challenge';
import FeedSuggestions from './FeedSuggestions';
import BottomToolbar from './FeedBottomToolbar';

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
			return <Badge date={feedItem.date} achievement={feedItem.achievement} />;
		case types.courseStarted:
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}`;
			return <Course date={feedItem.date} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
		case types.courseCompleted:
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}`;
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
					onChange={(vote, newVote) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.post.id })}
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
					onChange={({ vote: newVote, votes }) => { voteFeedItem({ ...feedItem, newVote, targetId: feedItem.post.id }); }}
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
					onChange={(vote, newVote) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.code.id })}
				/>
			);
		case types.completedChallange:
			this.url = `/profile/${feedItem.contest.player.id}`;
			return <Challenge date={feedItem.date} contest={feedItem.contest} />;
		case types.suggestions:
			return <FeedSuggestions number={feedItem.number} />;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			this.url = `/learn/course/${toSeoFriendly(feedItem.course.name)}?commentID=${feedItem.comment.id}`;
			return (
				<Comment
					url={this.url}
					comment={feedItem.comment}
					date={feedItem.date}
					type="lessonComment"
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={(vote, newVote) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
				/>
			);
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
			this.url = `/learn/lesson/${feedItem.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${feedItem.userLesson.id}/${toSeoFriendly(feedItem.userLesson.name, 100)}/1?commentID=${feedItem.comment.id}`;
			return (
				<Comment
					url={this.url}
					comment={feedItem.comment}
					date={feedItem.date}
					type="userLessonComment"
					userVote={feedItem.vote}
					totalVotes={feedItem.votes}
					onChange={(vote, newVote) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
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
					onChange={(vote, newVote) => voteFeedItem({ ...feedItem, newVote, targetId: feedItem.comment.id })}
				/>
			);
		case types.lessonCreated:
			this.url = `/learn/lesson/${feedItem.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${feedItem.userLesson.id}/${toSeoFriendly(feedItem.userLesson.name, 100)}/1`;
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
		default:
			return null;
		}
	}

	render() {
		const { feedItem } = this.props;
		// Render only suggestions
		if (feedItem.type === types.suggestions) {
			return (
				<Container>
					{this.renderFeedItem()}
				</Container>
			);
		} else if (feedItem.type === types.mergedChallange) {
			return (
				<Container>
					<PaperContainer
						zDepth={1}
						className="feedItem"
						onClick={this.handleChallengesOpen}
					>
						<FeedItemBase
							feedItemId={feedItem.id}
							title={feedItem.title}
							user={feedItem.user}
							date={feedItem.date}
							votes={this.votes}
						/>
						<BottomToolbar date={feedItem.date} />
					</PaperContainer>
					<Container
						id="feed-items"
						className={`merged-items-container ${this.state.isOpened ? 'open' : ''}`}
						style={{ height: this.state.isOpened ? ((feedItem.groupedItems.length * 139) - 10) : 0 }} // 10 = last item margin bottom
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
					</Container>
				</Container>
			);
		}
		return (
			<Container className="feedItemWrapper">
				<PaperContainer zDepth={1} className="feedItem">
					<FeedItemBase
						feedItemId={feedItem.id}
						title={feedItem.title}
						user={feedItem.user}
						votes={this.votes}
					>
						{this.renderFeedItem()}
					</FeedItemBase>
				</PaperContainer>

			</Container>
		);
	}
}

export default FeedItem;
