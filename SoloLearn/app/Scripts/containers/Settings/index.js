import React from 'react';
import { Link } from 'react-router';
import Layout from 'components/Layouts/GeneralLayout';

import 'styles/Settings/index.scss';

import Main from './Profile';
import Blocked from './Blocked';
import Arsenal from './Arsenal';
import ContentSettings from './Content';

const SettingsMapping = {
	profile: Main,
	blocking: Blocked,
	weapons: Arsenal,
	content: ContentSettings,
};

const Settings = ({ params: { settingID = 'profile' } }) => {
	const SettingsComponent = SettingsMapping[settingID];
	return (
		<Layout className="settings-container">
			<div className="settings-sections">
				<Link to="/settings/profile">Profile Settings</Link>
				<Link to="/settings/blocking">Blocking</Link>
				<Link to="/settings/weapons">Arsenal Management</Link>
				<Link to="/settings/content">Content Preferences</Link>
			</div>
			<div className="settings-main">
				<SettingsComponent />
			</div>
		</Layout>
	);
};

export default Settings;
