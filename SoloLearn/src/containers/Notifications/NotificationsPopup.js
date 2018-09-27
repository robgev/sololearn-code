// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Redux modules
import { markRead, markAllSeen } from 'actions/notifications';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsPopupStyles as styles } from './styles';

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
				defaultStyle={{ opacity: 0, top: 40 }}
				style={{
					opacity: spring(1),
					top: spring(31, { stiffness: 120, damping: 15 }),
				}}
			>
				{
					interpolatingStyle =>
						(
							<div id="notifications" className="notifications" style={{ ...styles.wrapper, ...interpolatingStyle }}>
								<div className="arrow" style={styles.arrow} />
								<Paper className="notifications-container" style={styles.notificationsContainer}>
									<div className="notification-header" style={styles.notificationsHeader}>
										<p className="notifications-title" style={styles.notificationsTitle}>{t('notifications.title')}</p>
										<button
											type="button"
											style={styles.notificationsHeaderButton}
											onClick={this.markAllRead}
										>
											{t('notifications.mark-all-as-read-action-title')}
										</button>
									</div>
									<Divider />
									<NotificationList
										isPopup
										toggleNotificationsOpen={this.props.toggleNotificationsOpen}
									/>
									<Divider />
									<div className="notification-footer" style={styles.notificationsFooter}>
										<Link
											className="hoverable"
											to="/notifications"
											onClick={this.props.toggleNotificationsOpen}
											style={styles.notificationsFooterButton}
										>
											{t('notifications.see-all')}
										</Link>
									</div>
								</Paper>
							</div>
						)
				}
			</Motion>
		);
	}
}

export default NotificationPopup;
