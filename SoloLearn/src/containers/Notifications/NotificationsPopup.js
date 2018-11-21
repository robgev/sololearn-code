import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { markRead, markAllSeen } from 'actions/notifications';
import NotificationList from './NotificationList';
import {
	PaperContainer,
	Container,
	Title,
	HorizontalDivider,
} from 'components/atoms';
import { UsernameLink } from 'components/molecules';

import './NotificationsPopup.scss';

const mapDispatchToProps = { markRead, markAllSeen };

@connect(null, mapDispatchToProps)
@translate()
class NotificationPopup extends Component {
	componentDidMount() {
		this.props.markAllSeen();
		document.addEventListener('click', this.handleDocumentClick);
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		document.removeEventListener('click', this.handleDocumentClick);
	}

	// Using fat arrow to bind to instance
	handleDocumentClick = (e) => {
		const notificationsArea = document.getElementById('notifications');
		if (!notificationsArea.contains(e.target) && this.props.isOpened) {
			this.props.toggleNotificationsOpen();
		}
	}

	markAllRead = () => {
		this.props.markRead(null);
	}

	render() {
		const { t } = this.props;
		return (
			<Motion
				style={{
					opacity: spring(1),
					top: spring(31, { stiffness: 120, damping: 15 }),
				}}
			>
				{
					interpolatingStyle =>
						(
							<Container id="notifications" className="notification-popup-wrapper" style={{...interpolatingStyle }}>
								<Container className="arrow"/>
								<PaperContainer className="notifications-container">
									<Container className="notifications-header">
										<Title className="notifications-title" >{t('notifications.title')}</Title>
										<UsernameLink
											onClick={this.markAllRead}
										>
											{t('notifications.mark-all-as-read-action-title')}
										</UsernameLink>
									</Container>
									<HorizontalDivider />
									<NotificationList
										isPopup
										toggleNotificationsOpen={this.props.toggleNotificationsOpen}
									/>
									<HorizontalDivider />
									<Container className="notifications-footer">
										<UsernameLink
											to="/notifications"
											onClick={this.props.toggleNotificationsOpen}
										>
											{t('notifications.see-all')}
										</UsernameLink>
									</Container>
								</PaperContainer>
							</Container>
						)
				}
			</Motion>
		);
	}
}

export default NotificationPopup;
