// General modules
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// Material UI components
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// Redux modules
import {
	setNotificationCount,
	refreshNotifications,
	getNotifications,
	markRead,
} from 'actions/notifications';
import {
	notificationsCountSelector,
} from 'reducers/notifications.reducer';

import 'styles/Notifications/index.scss';

// Additional components
import NotificationToaster from './NotificationToaster'; // For static funcs
import NotificationsPopup from './NotificationsPopup';

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
					style={{ padding: 0, paddingRight: 10 }}
					badgeStyle={{
						top: 11,
						right: 14,
						zIndex: 1,
						height: 16,
						color: '#fff',
						fontSize: 11,
						minWidth: 16,
						width: 'initial',
						borderRadius: 8,
						cursor: 'pointer',
						backgroundColor: '#F44336',
						visibility: count <= 0 ? 'hidden' : 'initial',
					}}
					badgeContent={count}
					onClick={this.toggleNotificationsOpen}
				>
					<IconButton
						className="notification-button"
						onClick={this.toggleNotificationsOpen}
					>
						<NotificationsIcon color="#fff" />
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
