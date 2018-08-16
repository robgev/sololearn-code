import React from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router';
import NotFound from 'components/NotFound';
import Layout from 'components/Layouts/GeneralLayout';

// i18n
import { translate } from 'react-i18next';

import 'styles/Settings/index.scss';

import Main from './Profile';
import Blocked from './Blocked';
// import Arsenal from './Arsenal';
import ContentSettings from './Content';
import Localization from './Localization';
import Password from './Password';

const SettingsMapping = {
	profile: Main,
	blocking: Blocked,
	// weapons: Arsenal,
	content: ContentSettings,
	localization: Localization,
	password: Password,
};

const Settings = ({ t, params: { settingID = 'profile' } }) => {
	document.title = 'Sololearn | Settings';
	ReactGA.ga('send', 'screenView', { screenName: 'Settings Page' });
	const SettingsComponent = SettingsMapping[settingID];
	return SettingsComponent
		? (
			<Layout className="settings-container">
				<div className="settings-sections">
					<Link className="hoverable" to="/settings/profile">{t('settings.edit-profile')}</Link>
					<Link className="hoverable" to="/settings/password">{t('settings.change-password')}</Link>
					<Link className="hoverable" to="/settings/blocking">{t('settings.blocked-accounts')}</Link>
					{/* <Link className="hoverable" to="/settings/weapons">{t('settings.manage-weapons')}</Link> */}
					<Link className="hoverable" to="/settings/content">{t('settings.activity-feed')}</Link>
					<Link className="hoverable" to="/settings/localization">{t('settings.language')}</Link>
				</div>
				<div className="settings-main">
					<SettingsComponent />
				</div>
			</Layout>
		)
		: <NotFound />;
};

export default translate()(Settings);
