import React from 'react';
import ReactGA from 'react-ga';
import { 
	Link, 
	PaperContainer, 
	Container, 
	SecondaryTextBlock 
} from 'components/atoms';
import NotFound from 'components/NotFound';
import { Layout } from 'components/molecules';

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
			<Layout>
				<PaperContainer className="settings-container">
					<Container className="settings-sections">
						<Container className="settings-tab">
							<Link to="/settings/profile"><SecondaryTextBlock>{t('settings.edit-profile')}</SecondaryTextBlock></Link>
						</Container>
						<Container className="settings-tab">
							<Link to="/settings/password"><SecondaryTextBlock>{t('settings.change-password')}</SecondaryTextBlock></Link>
						</Container>
						<Container className="settings-tab">
							<Link to="/settings/blocking"><SecondaryTextBlock>{t('settings.blocked-accounts')}</SecondaryTextBlock></Link>
						</Container>
						<Container className="settings-tab">
							<Link to="/settings/content"><SecondaryTextBlock>{t('settings.activity-feed')}</SecondaryTextBlock></Link>
						</Container>
						<Container className="settings-tab">
							<Link to="/settings/localization"><SecondaryTextBlock>{t('settings.language')}</SecondaryTextBlock></Link>
						</Container>
					</Container>
					<Container className="settings-main">
						<SettingsComponent />
					</Container>
				</PaperContainer>
			</Layout>
		)
		: <NotFound />;
};

export default translate()(Settings);
