import React from 'react';
import { translate } from 'react-i18next';
import 'styles/Profile/ProfileSidebar.scss';

const ProfileSidebar = ({ t }) => (
	<div className="profile-sidebar-root">
		<div className="sidebar-title">
			<p className="title">Highlights</p>
		</div>
		<div className="profile-sidebar-container">
			<p className="coming-soon">{t('skills.coming-soon')}!</p>
		</div>
	</div>
);

export default translate()(ProfileSidebar);
