// General modules
import React, { PureComponent } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// Redux modules
import { getNotificationCountInternal } from 'actions/profile';

// Additional components
import NotificationsPopup from './NotificationsPopup';

const styles = {
	notifications: {
		position: 'relative',
		zIndex: 1000,
		float: 'right',
	},

	notificationsButton: {
		base: {
			width: '40px',
			height: '40px',
			padding: '10px',
		},

		icon: {
			width: '20px',
			height: '20px',
		},
	},
	zeroPlus: {
		width: '10px',
		height: '10px',
		fontSize: '8px',
		top: 30,
		right: 29,
		padding: '2px',
		backgroundColor: '#F44336',
		color: '#fff',
		border: '1px solid #607d8b',
		zIndex: 1,
	},
	zero: {
		visibility: 'hidden',
	},
};

class NotificationManager extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpened: false,
		};

		this.interval = null;
	}

// Open or close notifications list
toggleNotificationsOpen = () => {
	this.setState({ isOpened: !this.state.isOpened });
}

render() {
	return (
		<div id="notifications" ref="notifications" style={styles.notifications}>
			<Badge
				badgeContent={0 | this.props.notificationsCount}
				style={{ margin: '0 10px 0 0' }}
				badgeStyle={this.props.notificationsCount > 0 ? styles.zeroPlus : styles.zero}
			>
				<IconButton className="notifications-button" style={styles.notificationsButton.base} iconStyle={styles.notificationsButton.icon} onClick={this.toggleNotificationsOpen}>
					<NotificationsIcon color="#fff" />
				</IconButton>
			</Badge>

			{this.state.isOpened && <NotificationsPopup isOpened={this.state.isOpened} toggleNotificationsOpen={this.toggleNotificationsOpen} />}
		</div>
	);
}

componentWillMount() {
// Get unseen notifications count
	this.props.getNotificationCount();
// this.interval = setInterval(() => { this.props.getNotificationCount() }, 10000);
}

componentWillUnmount() {
// clearInterval(this.interval);
}
}

function mapStateToProps(state) {
	return {
		notificationsCount: state.notificationsCount,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getNotificationCount: getNotificationCountInternal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(NotificationManager));
