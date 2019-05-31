// General modules
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { toast, Slide } from 'react-toastify';
import types from 'defaults/appTypes';
import { updateDate, toSeoFriendly, stopPropagation } from 'utils';
import { Container, SecondaryTextBlock } from 'components/atoms';
import {
	ProfileAvatar,
	RoundImage,
	UsernameLink,
	ContainerLink,
} from 'components/molecules';
import {
	Mention,
} from 'components/organisms';

import './NotificationToaster.scss';

class NotificationToaster extends Component {
	static toast = (notification, markRead, onClick = () => { }) => toast(() => (
		<Container
			role="button"
			tabIndex="0"
			onClick={() => NotificationToaster.handleClick(notification, markRead, onClick)}
			className="notification-snackbar"
		>
			{NotificationToaster.generateContent(notification)}
		</Container>
	), {
		position: 'bottom-right',
		transition: Slide,
		autoClose: 2000,
	})

	static handleClick = (notification, markRead, onClick) => {
		const ids = [ notification.id ];

		if (notification.groupedItems.length > 1) {
			notification.groupedItems.forEach((item) => {
				if (!item.isClicked) ids.push(item.id);
			});
		}
		markRead(ids);
		browserHistory.push(NotificationToaster.getNotificationLink(notification));
		onClick();
	}

	static getTitle = (fullTitle, notification) => {
		const mentionRegex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/.exec(fullTitle);
		if (mentionRegex !== null) {
			fullTitle = fullTitle.replace(mentionRegex[0], `${mentionRegex[2]}`);
		}

		if (fullTitle.includes('{other}')) {
			return fullTitle.replace('{other}', notification.groupedItems.length);
		}
		const pattern = /({action_user}|{opponent}|{main})/.exec(fullTitle);
		if (pattern !== null) {
			const link = (
				<UsernameLink
					key="profile-link"
					onClick={stopPropagation}
					to={`/profile/${notification.actionUser.id}`}
				>
					{notification.actionUser.name}
				</UsernameLink>
			);
			const splitTitle = fullTitle.split(pattern[0]);
			return [ splitTitle[0], link, splitTitle[1] ];
		}
		return fullTitle;
	}

	static generateContent = (notification, onClick = () => {}) => {
		const notificationTitle =
			notification.groupedItems.length > 1 ? notification.message : notification.title;

		const title = NotificationToaster.getTitle(notificationTitle, notification);
		const link = NotificationToaster.getNotificationLink(notification);

		return (
			<ContainerLink onClick={onClick} to={link} className="notification-content" >
				{
					notification.type === types.badgeUnlocked ?
						<Container className="achievement-icon-container" style={{ backgroundColor: notification.achievement.color }}>
							<RoundImage
								alt="Achievement icon"
								className="achievement-icon"
								src={notification.achievement.icon}
							/>
						</Container> :
						<ProfileAvatar
							user={notification.actionUser}
						/>
				}
				<Container className="additional-details">
					<SecondaryTextBlock
						className="title"
					>
						{title}
					</SecondaryTextBlock>
					<Container className="date-container">
						<SecondaryTextBlock className="date">{updateDate(notification.date)}</SecondaryTextBlock>
						{!notification.isClicked && <Container className="notClickedIcon" />}
					</Container>
				</Container>
			</ContainerLink>
		);
	}

	static getNotificationLink = (notification) => {
		switch (notification.type) {
		case types.completedChallange:
		case types.startedChallange:
			return `/challenge/${notification.contest.id}`;
		case types.postedQuestion:
			return `/discuss/${notification.post.id}`;
		case types.upvotePost:
		case types.mentionPost:
			return notification.post.parentID === null
				? `/discuss/${notification.post.id}`
				: `/discuss/${notification.post.parentID}/answer/${notification.post.id}`;
		case types.postedAnswer:
			return `/discuss/${notification.post.parentID}/answer/${notification.post.id}`;
		case types.following:
		case types.friendJoined:
		case types.leveledUp:
			return `/profile/${notification.actionUser.id}`;
		case types.badgeUnlocked:
			return `/profile/${notification.user.id}/badges?badgeID=${notification.achievement.id}`;
		case types.postedCodeComment:
		case types.postedCodeCommentReply:
		case types.upvoteCodeComment:
		case types.mentionCodeComment:
			return `/playground/${notification.code.publicID}?commentID=${notification.codeComment.id}`;
		case types.postedCode:
		case types.upvoteCode:
			return `/playground/${notification.code.publicID}`;
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
		case types.upvoteUserLessonComment:
			return `/learn/${notification.userLesson.id}/${toSeoFriendly(notification.userLesson.name, 100)}/1?commentID=${notification.userLessonComment.id}`;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
		case types.upvoteComment:
			return `/learn/${toSeoFriendly(notification.course.name)}?commentID=${notification.comment.id}`;
		case types.challangeReviewRejected:
		case types.challangeReviewPublished:
			return `/quiz-factory/my-submissions?id=${notification.challenge.id}`;
		case types.lessonReviewRejected:
		case types.lessonReviewPublished:
			return '/lesson-factory/my-submissions';
		case types.userPostComment:
		case types.userPostCommentReply:
		case types.userPostCommentUpvote:
		case types.userPostCommentMention:
			return `/post/${notification.userPost.id}?commentID=${notification.userPostComment.id}`;
		case types.userPost:
		case types.userPostUpvote:
		case types.userPostMention:
			return `/post/${notification.userPost.id}`;
		default:
			throw new Error('Unknown notification link');
		}
	}
}

export default NotificationToaster;
