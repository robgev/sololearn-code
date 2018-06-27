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
	getNotificationCountInternal as getNotificationCount,
} from 'actions/profile';

import 'styles/Notifications/index.scss';

// Additional components
import NotificationsPopup from './NotificationsPopup';

const mapStateToProps = ({ notificationsCount }) => ({ notificationsCount });

const mapDispatchToProps = { getNotificationCount, setNotificationCount };

@connect(mapStateToProps, mapDispatchToProps)
class NotificationManager extends PureComponent {
	state = { isOpened: false };

	componentWillMount() {
		this.props.getNotificationCount();
	}

	toggleNotificationsOpen = () => {
		this.setState({ isOpened: !this.state.isOpened });
		this.props.setNotificationCount(0);
	}

	render() {
		const { isOpened } = this.state;
		const { notificationsCount } = this.props;
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
						backgroundColor: '#F44336',
						border: '1px solid #607d8b',
						visibility: notificationsCount <= 0 ? 'hidden' : 'initial',
					}}
					badgeContent={notificationsCount}
				>
					<IconButton
						className="notification-button"
						onClick={this.toggleNotificationsOpen}
					>
						<NotificationsIcon color="#fff" />
					</IconButton>
				</Badge>
				{ isOpened &&
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
