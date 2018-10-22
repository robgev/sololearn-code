// General modules
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { toast, Slide } from 'react-toastify';

// Utils And Defaults
import types from 'defaults/appTypes';
import { updateDate, toSeoFriendly, stopPropagation } from 'utils';
import ProfileAvatar from 'components/ProfileAvatar';

import { NotificationItemStyles as styles } from './styles';

class NotificationToaster extends Component {
	static toast = (notification, markRead, onClick = () => { }) => toast(() => (
		<div
			role="button"
			tabIndex="0"
			onClick={() => NotificationToaster.handleClick(notification, markRead, onClick)}
			className="notification-snackbar"
		>
			{NotificationToaster.generateContent(notification)}
		</div>
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
		if (fullTitle.includes('{other}')) {
			return fullTitle.replace('{other}', notification.groupedItems.length);
		}
		const pattern = /({action_user}|{opponent}|{main})/.exec(fullTitle);
		if (pattern !== null) {
			const link = (
				<Link
					key="profile-link"
					className="hoverable"
					onClick={stopPropagation}
					to={`/profile/${notification.actionUser.id}`}
					style={{ color: '#8BC34A', textDecoration: 'none' }}
				>
					{notification.actionUser.name}
				</Link>
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
			<Link onClick={onClick} to={link} className="notification-content" style={styles.notificationContent}>
				{
					notification.type === types.badgeUnlocked ?
						<div style={{ ...styles.badge.base, backgroundColor: notification.achievement.color }}>
							<img
								alt="Achievement icon"
								style={styles.badge.icon}
								src={notification.achievement.icon}
							/>
						</div> :
						<ProfileAvatar
							style={styles.avatar}
							badge={notification.actionUser.badge}
							userID={notification.actionUser.id}
							userName={notification.actionUser.name}
							avatarUrl={notification.actionUser.avatarUrl}
						/>
				}
				<div className="additional-details" style={styles.additionalDetails}>
					<p
						className="title"
						style={styles.title}
					>
						{title}
					</p>
					<div>
						<span className="date" style={styles.date}>{updateDate(notification.date)}</span>
						{!notification.isClicked && <span style={styles.notClickedIcon} />}
					</div>
				</div>
			</Link>
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
			return `/learn/lesson/${notification.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${notification.userLesson.id}/${notification.userLesson.name}/1?commentID=${notification.userLessonComment.id}`;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
		case types.upvoteComment:
			return `/learn/course/${toSeoFriendly(notification.course.name)}?commentID=${notification.comment.id}`;
		case types.challangeReviewRejected:
		case types.challangeReviewPublished:
			return '/quiz-factory/my-submissions';
		case types.lessonReviewRejected:
		case types.lessonReviewPublished:
			return '/lesson-factory/my-submissions';
		default:
			throw new Error('Unknown notification link');
		}
	}
}

export default NotificationToaster;
