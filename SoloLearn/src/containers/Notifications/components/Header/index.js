import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Title } from 'components/atoms';
import { UsernameLink } from 'components/molecules';
import { markRead } from 'actions/notifications';

import './styles.scss';

const NotificationHeader = ({ t, markRead }) => (
	<Container className="notifications-header">
		<Title>{t('notifications.title')}</Title>
		<UsernameLink
			className="notifications_mark-read"
			onClick={() => { markRead(null); }}
		>
			{t('notifications.mark-all-as-read-action-title')}
		</UsernameLink>
	</Container>
);

const mapDispatchToProps = { markRead };

export default translate()(connect(null, mapDispatchToProps)(NotificationHeader));
