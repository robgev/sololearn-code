import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Title } from 'components/atoms';
import { UsernameLink } from 'components/molecules';
import { markRead } from 'actions/notifications';
import { notificationsSelector } from 'reducers/notifications.reducer';

import './styles.scss';

const isAllRead = (notifications) => {
	console.log(notifications);
	const isRead = notifications.find(not => not.isClicked === false);
	console.log(isRead);
	return isRead;
};

const NotificationHeader = ({ t, markRead, notifications }) => {
	const isRead = isAllRead(notifications);

	return (
		<Container className="notifications-header">
			<Title>{t('notifications.title')}</Title>
			<UsernameLink
				className={`notifications_mark-read ${!isRead && 'diasbale_mark-read'}`}
				onClick={(e) => { isRead ? markRead(null) : e.preventDefault(); }}
			>
				{t('notifications.mark-all-as-read-action-title')}
			</UsernameLink>
		</Container>
	);
};

const mapStateToProps = state =>	({ notifications: notificationsSelector(state) });

const mapDispatchToProps = { markRead };

export default translate()(connect(mapStateToProps, mapDispatchToProps)(NotificationHeader));
