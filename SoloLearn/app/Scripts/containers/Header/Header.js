// React modules
import React from 'react';
import 'styles/header.scss';

// Additional components
import TabList from './Tabs';
import NotificationManager from '../Notifications/NotificationManager';
import SettingsMenu from './HeaderSettingsMenu';

const Header = () => (
	<div className="header">
		<SettingsMenu />
		<TabList />
		<NotificationManager />
	</div>
);

export default Header;
