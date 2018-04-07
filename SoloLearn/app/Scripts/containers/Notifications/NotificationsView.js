// React modules
import React from 'react';
import Radium from 'radium';
import Layout from 'components/Layouts/GeneralLayout';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsViewStyles as styles } from './styles';

const Notifications = () => {
	document.title = 'Sololearn | Notifications';
	return (
		<Layout>
			<Paper>
				<div className="notification-header" style={styles.notificationsHeader}>
					<p className="notifications-title" style={styles.notificationsTitle}>Your Notifications</p>
				</div>
				<Divider />
				<NotificationList isPopup={false} />
			</Paper>
		</Layout>
	);
};

export default Radium(Notifications);
