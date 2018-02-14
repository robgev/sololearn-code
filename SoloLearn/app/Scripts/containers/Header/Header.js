// React modules
import React from 'react';
import { Link } from 'react-router';
import 'styles/header.scss';
import HomeIcon from './HomeIcon';

// Additional components
import TabList from './Tabs';
import NotificationManager from '../Notifications/NotificationManager';
import SettingsMenu from './HeaderSettingsMenu';

const Header = ({ pathname }) => (
	<div className="header">
		<div className="header-wrapper">
			<div className="header-right">
				<Link to="/feed" className="home-icon">
					<HomeIcon />
				</Link>
				{/* Search */}
				<TabList pathname={pathname} />
			</div>
			<div className="header-left">
				<NotificationManager />
				<SettingsMenu />
			</div>
		</div>
	</div>
);

export default Header;
