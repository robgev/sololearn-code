// React modules
import React from 'react';
import { translate } from 'react-i18next';
import Layout from 'components/Layouts/GeneralLayout';
import DiscoverPeersSidebar from 'containers/Feed/FeedSidebar';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsViewStyles as styles } from './styles';

const Notifications = ({ t }) => {
	document.title = 'Sololearn | Notifications';
	return (
		<Layout
			sidebarContent={<DiscoverPeersSidebar t={t} />}
		>
			<Paper>
				<div className="notification-header" style={styles.notificationsHeader}>
					<p className="notifications-title" style={styles.notificationsTitle}>{t('notifications.title')}</p>
				</div>
				<Divider />
				<NotificationList isPopup={false} />
			</Paper>
		</Layout>
	);
};

export default translate()(Notifications);
