// React modules
import React from 'react';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Additional components
import NotificationList from './NotificationList';

const styles = {
	container: {
		width: '1000px',
		margin: '20px auto',
	},

	notificationsHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '11px 14px',
	},

	notificationsTitle: {
		fontSize: '13px',
		fontWeight: 500,
	},

};

const Notifications = () => (
	<Paper style={styles.container}>
		<div className="notification-header" style={styles.notificationsHeader}>
			<p className="notifications-title" style={styles.notificationsTitle}>Your Notifications</p>
		</div>
		<Divider />
		<NotificationList isPopup={false} />
	</Paper>
);

export default Radium(Notifications);
