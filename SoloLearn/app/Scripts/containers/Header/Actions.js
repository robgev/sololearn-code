// React modules
import React, { Component } from 'react';

// import IconMenu from 'material-ui/IconMenu';
// import MenuItem from 'material-ui/MenuItem';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import NotificationManager from '../Notifications/NotificationManager';
import SettingsMenu from '../Settings/SettingsMenu';

// Material UI components
// import IconButton from 'material-ui/IconButton';
// import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

export default class Actions extends Component {
	render() {
		return (
			<div>
				<SettingsMenu />
				<NotificationManager />
			</div>
		);
	}
}
