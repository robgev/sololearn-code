// General modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

// Material UI components
import { ListItem } from 'material-ui/List';

// Redux modules
import { setSelectedComment } from 'actions/comments';
import { markReadInternal } from 'actions/profile';

// Utils And Defaults
import types from 'defaults/appTypes';
import { updateDate } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import { NotificationItemStyles as styles } from './styles';

const mapDispatchToProps = {
	markRead: markReadInternal,
	setSelectedComment,
};

@connect(null, mapDispatchToProps)
class NotificationItem extends Component {
	handleClick = () => {
		const { notification } = this.props;
		const ids = [ notification.id ];

		if (notification.groupedItems.length > 1) {
			notification.groupedItems.forEach((item) => {
				if (!item.isClicked) ids.push(item.id);
			});
		}
		this.props.markRead(ids);
		this.openNotificationLink(notification);
		this.props.handleOpenIfPopup();
	}

	openNotificationLink = (notification) => {
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
		case types.upvoteComment:
		case types.postedAnswer:
			browserHistory.push(`/discuss/${notification.post.parentID}/answer/${notification.post.id}`);
			break;
		case types.following:
		case types.friendJoined:
			browserHistory.push(`/profile/${notification.actionUser.id}`);
			break;
		case types.badgeUnlocked:
			browserHistory.push(`/profile/${notification.user.id}/badges`);
			break;
		case types.postedCodeComment:
		case types.postedCodeCommentReply:
		case types.upvoteCodeComment:
			this.props.setSelectedComment(notification.codeComment.id);
			browserHistory.push(`/playground/${notification.code.publicID}`);
			break;
		case types.postedLessonComment:
		case types.postedLessonCommentReply:
			this.props.setSelectedComment(notification.codeComment.id);
			break;
		default:
			break;
		}
	}

	getTitleUser = (title, pattern) => {
		const { notification } = this.props;
		const href = `/profile/${notification.actionUser.id}`;
		return title.replace(pattern, `<a href=${href} style="text-decoration:none;color:#8BC34A;font-weight:500;">${notification.actionUser.name}</a>`);
	}

	generateContent = () => {
		const { notification } = this.props;
		let notificationTitle =
			notification.groupedItems.length > 1 ? notification.message : notification.title;

		if (notificationTitle.includes('{action_user}')) {
			notificationTitle = this.getTitleUser(notificationTitle, '{action_user}');
		}
		if (notificationTitle.includes('{opponent}')) {
			notificationTitle = this.getTitleUser(notificationTitle, '{opponent}');
		}
		if (notificationTitle.includes('{main}')) {
			notificationTitle = this.getTitleUser(notificationTitle, '{main}');
		}
		if (notificationTitle.includes('{other}')) {
			notificationTitle = notificationTitle.replace('{other}', notification.groupedItems.length);
		}

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
							userID={notification.actionUser.id}
							userName={notification.actionUser.name}
							avatarUrl={notification.actionUser.avatarUrl}
						/>
				}
				<div className="additional-details" style={styles.additionalDetails}>
					<p
						className="title"
						style={styles.title}
						dangerouslySetInnerHTML={{ __html: notificationTitle }}
					/>
					<div>
						<span className="date" style={styles.date}>{updateDate(notification.date)}</span>
						{!notification.isClicked && <span style={styles.notClickedIcon} />}
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<ListItem className="notification-item" containerElement="div" innerDivStyle={styles.notificationItemInner} style={styles.notificationItem} onClick={this.handleClick}>
				{this.generateContent()}
			</ListItem>
		);
	}

	shouldComponentUpdate(nextProps) {
		return this.props.notification.isClicked !== nextProps.notification.isClicked;
	}
}

export default NotificationItem;
