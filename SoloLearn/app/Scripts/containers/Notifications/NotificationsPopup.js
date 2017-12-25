// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

// Material UI components
import { Paper, Divider } from 'material-ui';

// Redux modules
import { markReadInternal } from 'actions/profile';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsPopupStyles as styles } from './styles';

const RadiumLink = Radium(Link);

const mapDispatchToProps = { markAllRead: markReadInternal };

@connect(null, mapDispatchToProps)
@Radium
class NotificationPopup extends Component {
	componentDidMount() {
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

	render() {
		return (
			<Motion
				defaultStyle={{ opacity: 0, top: 40 }}
				style={{
					opacity: spring(1),
					top: spring(50, { stiffness: 120, damping: 15 }),
				}}
			>
				{
					interpolatingStyle =>
						(
							<div id="notifications" style={[ styles.wrapper, interpolatingStyle ]}>
								<div className="arrow" style={styles.arrow} />
								<Paper className="notifications-container" style={styles.notificationsContainer}>
									<div className="notification-header" style={styles.notificationsHeader}>
										<p className="notifications-title" style={styles.notificationsTitle}>Notifications</p>
										<button
											type="button"
											style={styles.notificationsHeaderButton}
											onClick={() => this.props.markAllRead(null)}
										>Mark all as read
										</button>
									</div>
									<Divider />
									<NotificationList
										isPopup
										toggleNotificationsOpen={this.props.toggleNotificationsOpen}
									/>
									<Divider />
									<div className="notification-footer" style={styles.notificationsFooter}>
										<RadiumLink
											to="/notifications"
											onClick={this.props.toggleNotificationsOpen}
											style={styles.notificationsFooterButton}
										>See All
										</RadiumLink>
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
