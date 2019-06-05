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

import UserPost from './FeedTemplates/UserPost';

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
		console.log('FeedItem render', feedItem);
		switch (feedItem.type) {
		case types.badgeUnlocked:
			this.url = `/profile/${feedItem.user.id}/badges?badgeID=${feedItem.achievement.id}`;
			return <Badge date={feedItem.date} achievement={feedItem.achievement} url={this.url} />;
		case types.courseStarted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.name)}`;
			return <Course date={feedItem.date} course={feedItem.course} openPopup={this.props.openCoursePopup} />;
		case types.courseCompleted:
			this.url = `/learn/${toSeoFriendly(feedItem.course.name)}`;
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
			return <Challenge date={feedItem.date} contest={feedItem.contest} />;
		case types.suggestions:
			return <FeedSuggestions number={feedItem.number} />;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			this.url = `/learn/${toSeoFriendly(feedItem.course.name)}?commentID=${feedItem.comment.id}`;
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
		default:
			return null;
		}
	}

	render() {
		const { feedItem, style, voteFeedItem } = this.props;
		// Render only suggestions
		if (feedItem.type === types.suggestions) {
			return (
				<Container style={style}>
					{this.renderFeedItem()}
				</Container>
			);
		} else if (feedItem.type === types.mergedChallange) {
			return (
				<Container style={style} className="feedItemWrapper">
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
					{ this.props.open &&
					<Container
						id="feed-items"
						className={`merged-items-container ${this.props.open ? 'open' : ''}`}
					>
						{feedItem.groupedItems.map(currentItem => (
							<Container
								key={currentItem.type === types.mergedChallange ?
									`feedGroup${currentItem.toId}` :
									`feedItem${currentItem.id}`}
								className="feedItemWrapper"
							>
								<PaperContainer zDepth={1} className="feedItem">
									<FeedItemBase
										feedItemId={currentItem.id}
										title={currentItem.title}
										user={currentItem.user}
										votes={this.votes}
									>
										{/* this.url = `/profile/${currentItem.contest.player.id}`; */}
										<Challenge date={currentItem.date} contest={currentItem.contest} />
									</FeedItemBase>
								</PaperContainer>

							</Container>
						))}
					</Container>
					}
				</Container>
			);
		} else if (feedItem.type === types.userPost) {
			return (
				<Container style={style} className="feedItemWrapper">
					<PaperContainer
						zDepth={1}
						className="feedItem userPost"
					>
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
					</PaperContainer>
				</Container>
			);
		}
		return (
			<Container style={style} className="feedItemWrapper">
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
