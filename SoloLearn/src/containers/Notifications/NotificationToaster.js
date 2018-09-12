// General modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { toast, Slide } from 'react-toastify';

// Utils And Defaults
import types from 'defaults/appTypes';
import { updateDate, toSeoFriendly } from 'utils';
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
		NotificationToaster.openNotificationLink(notification);
		onClick();
	}

	static getTitle = (fullTitle, notification) => {
		if (fullTitle.includes('{other}')) {
			return fullTitle.replace('{other}', notification.groupedItems.length);
		}
		const pattern = /({action_user}|{opponent}|{main})/.exec(fullTitle);
		if (pattern !== null) {
			const href = `/profile/${notification.actionUser.id}`;
			const link = (
				<a
					style={{ color: '#8BC34A', textDecoration: 'none' }}
					className="hoverable"
					href={href}
				>{notification.actionUser.name}
				</a>
			);
			const splitTitle = fullTitle.split(pattern[0]);
			return [ splitTitle[0], link, splitTitle[1] ];
		}
		return fullTitle;
	}

	static generateContent = (notification) => {
		const notificationTitle =
			notification.groupedItems.length > 1 ? notification.message : notification.title;

		const title = NotificationToaster.getTitle(notificationTitle, notification);

		return (
			<div className="notification-content" style={styles.notificationContent}>
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
			</div>
		);
	}

	static openNotificationLink = (notification) => {
		switch (notification.type) {
		case types.completedChallange:
		case types.startedChallange:
		case types.challangeReviewRejected:
			browserHistory.push(`/challenge/${notification.contest.id}`);
			break;
		case types.postedQuestion:
			browserHistory.push(`/discuss/${notification.post.id}`);
			break;
		case types.upvotePost:
			browserHistory.push(notification.post.parentID
				? `/discuss/${notification.post.id}/answer`
				: `/discuss/${notification.post.parentID}/answer/${notification.post.id}`);
			break;
		case types.postedAnswer:
			browserHistory.push(`/discuss/${notification.post.parentID}/answer/${notification.post.id}`);
			break;
		case types.following:
		case types.friendJoined:
			browserHistory.push(`/profile/${notification.actionUser.id}`);
			break;
		case types.badgeUnlocked:
			browserHistory.push(`/profile/${notification.user.id}/badges?badgeID=${notification.achievement.id}`);
			break;
		case types.postedCodeComment:
		case types.postedCodeCommentReply:
		case types.upvoteCodeComment:
			browserHistory.push(`/playground/${notification.code.publicID}?commentID=${notification.codeComment.id}`);
			break;
		case types.postedUserLessonComment:
		case types.postedUserLessonCommentReply:
		case types.upvoteUserLessonComment:
			browserHistory.push(`/learn/lesson/${notification.userLesson.itemType === 3 ? 'course-lesson' : 'user-lesson'}/${notification.userLesson.id}/${notification.userLesson.name}/1?commentID=${notification.userLessonComment.id}`);
			break;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
		case types.upvoteComment:
			browserHistory.push(`/learn/course/${notification.course.name}?commentID=${notification.comment.id}`);
			break;
		default:
			break;
		}
	}
}

export default NotificationToaster;
