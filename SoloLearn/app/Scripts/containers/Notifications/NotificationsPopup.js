// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

// Redux modules
import { markReadInternal } from 'actions/profile';

// Additional components
import NotificationList from './NotificationList';

import { NotificationsPopupStyles as styles } from './styles';

const RadiumLink = Radium(Link);

class NotificationPopup extends Component {
	// Add event listeners after component mounts
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
				{interpolatingStyle =>
					(
						<div style={[ styles.wrapper, interpolatingStyle ]}>
							<div className="arrow" style={styles.arrow} />
							<Paper className="notifications-container" style={styles.notificationsContainer}>
								<div className="notification-header" style={styles.notificationsHeader}>
									<p className="notifications-title" style={styles.notificationsTitle}>Notifications</p>
									<button type="button" style={styles.notificationsHeaderButton} onClick={() => this.props.markAllRead(null)}>Mark all as read</button>
								</div>
								<Divider />
								<NotificationList
									isPopup
									toggleNotificationsOpen={this.props.toggleNotificationsOpen}
								/>
								<Divider />
								<div className="notification-footer" style={styles.notificationsFooter}>
									<RadiumLink to="/notifications" style={styles.notificationsFooterButton}>See All</RadiumLink>
								</div>
							</Paper>
						</div>
					)
				}
			</Motion>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		markAllRead: markReadInternal,
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(Radium(NotificationPopup));
