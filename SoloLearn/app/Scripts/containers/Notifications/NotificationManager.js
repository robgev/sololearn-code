// General modules
import React, { PureComponent } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// Redux modules
import { getNotificationCountInternal as getNotificationCount } from 'actions/profile';

// Additional components
import NotificationsPopup from './NotificationsPopup';

import { NotificationManagerStyles as styles } from './styles';

const mapStateToProps = ({ notificationsCount }) => ({ notificationsCount });

const mapDispatchToProps = { getNotificationCount };

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class NotificationManager extends PureComponent {
	state = {
		isOpened: false,
	};
	componentWillMount() {
		this.props.getNotificationCount();
	}

	toggleNotificationsOpen = () => {
		this.setState({ isOpened: !this.state.isOpened });
	}
	render() {
		return (
			<div style={styles.notifications}>
				<Badge
					badgeContent={this.props.notificationsCount}
					style={{ margin: '0 10px 0 0' }}
					badgeStyle={this.props.notificationsCount > 0 ? styles.zeroPlus : styles.zero}
				>
					<IconButton
						style={styles.notificationsButton.base}
						iconStyle={styles.notificationsButton.icon}
						onClick={this.toggleNotificationsOpen}
					>
						<NotificationsIcon color="#fff" />
					</IconButton>
				</Badge>
				{
					this.state.isOpened &&
					<NotificationsPopup
						isOpened={this.state.isOpened}
						toggleNotificationsOpen={this.toggleNotificationsOpen}
					/>
				}
			</div>
		);
	}
}

export default NotificationManager;
