import React from 'react';
import { Link } from 'react-router';
import Layout from 'components/Layouts/GeneralLayout';

// i18n
import { translate } from 'react-i18next';

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

const Settings = ({ t, params: { settingID = 'profile' } }) => {
	document.title = 'Sololearn | Settings';
	const SettingsComponent = SettingsMapping[settingID];
	return (
		<Layout className="settings-container">
			<div className="settings-sections">
				<Link to="/settings/profile">{t('settings.edit-profile')}</Link>
				<Link to="/settings/blocking">{t('settings.blocked-accounts')}</Link>
				<Link to="/settings/weapons">{t('settings.manage-weapons')}</Link>
				<Link to="/settings/content">{t('settings.activity-feed')}</Link>
			</div>
			<div className="settings-main">
				<SettingsComponent />
			</div>
		</Layout>
	);
};

export default translate()(Settings);
