// React modules
import React from 'react';
import Radium from 'radium';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsViewStyles as styles } from './styles';

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
