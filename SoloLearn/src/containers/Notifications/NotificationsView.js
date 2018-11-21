import React from 'react';
import { translate } from 'react-i18next';
import DiscoverPeersSidebar from 'containers/Feed/FeedSidebar';
import NotificationList from './NotificationList';
import { LayoutWithSidebar } from 'components/molecules';
import {
	PaperContainer,
	Title,
	HorizontalDivider,
} from 'components/atoms';

const Notifications = ({ t }) => {
	document.title = 'Sololearn | Notifications';
	return (
		<LayoutWithSidebar
			sidebar={<DiscoverPeersSidebar t={t} />}
		>
			<PaperContainer>
				<Title>{t('notifications.title')}</Title>
				<HorizontalDivider />
				<NotificationList isPopup={false} />
			</PaperContainer>
		</LayoutWithSidebar>
	);
};

export default translate()(Notifications);
