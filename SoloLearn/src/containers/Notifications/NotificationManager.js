import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
	setNotificationCount,
	refreshNotifications,
	getNotifications,
	markRead,
} from 'actions/notifications';
import {
	notificationsCountSelector,
} from 'reducers/notifications.reducer';

import NotificationToaster from './NotificationToaster'; // For static funcs
import NotificationsPopup from './NotificationsPopup';
import { Badge, IconButton } from 'components/atoms';
import { Notifications } from 'components/icons';

import './NotificationManager.scss';

const mapStateToProps = state => ({
	count: notificationsCountSelector(state),
});

const mapDispatchToProps = {
	setNotificationCount,
	refreshNotifications,
	getNotifications,
	markRead,
};

@connect(mapStateToProps, mapDispatchToProps)
class NotificationManager extends PureComponent {
	static REFRESH_TIMEOUT = 20 * 1000;

	state = { isOpened: false };

	componentDidMount() {
		this.subscribe();
	}

	componentWillUnmount() {
		this.unsibscribe();
	}

	subscribe = async () => {
		await this.props.getNotifications();
		this.refreshInterval = setInterval(
			this.refreshNotifications,
			NotificationManager.REFRESH_TIMEOUT,
		);
	}

	unsibscribe = () => {
		if (this.refreshInterval) {
			clearInterval(this.refreshInterval);
		}
	}

	refreshNotifications = async () => {
		const notifications = await this.props.refreshNotifications();
		notifications.forEach((notif) => {
			if (!notif.isSeen) {
				NotificationToaster.toast(
					notif,
					this.props.markRead,
				);
			}
		});
	}

	toggleNotificationsOpen = () => {
		this.setState({ isOpened: !this.state.isOpened });
		this.props.setNotificationCount(0);
	}

	render() {
		const { isOpened } = this.state;
		const { count } = this.props;
		return (
			<div className="notifications-button-container">
				<Badge
					classes={{ badge: 'notifications-badge', invisible: 'notifications-badge-invisible' }}
					badgeContent={count}
					invisible={count <= 0}
					onClick={this.toggleNotificationsOpen}
				>
					<IconButton
						className="notification-button"
						onClick={this.toggleNotificationsOpen}
					>
						<Notifications className="notifications-button-icon" />
					</IconButton>
				</Badge>
				{isOpened &&
					<NotificationsPopup
						isOpened={isOpened}
						toggleNotificationsOpen={this.toggleNotificationsOpen}
					/>
				}
			</div>
		);
	}
}

export default NotificationManager;
