// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';

// Service
import Service from 'api/service';

// Redux modules
import { isLoaded } from 'reducers';
import { getNotificationsInternal, emptyNotifications } from 'actions/profile';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import NotificationItem from './NotificationItem';

import { NotificationListStyles as styles } from './styles';

const mapStateToProps = state => ({
	notifications: state.notifications,
	isNotificationLoaded: isLoaded(state, 'notifications'),
});

const mapDispatchToProps = {
	getNotifications: getNotificationsInternal,
	emptyNotifications,
};

class NotificationList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			fullyLoaded: false,
		};
		this.isUnmounted = false;
		ReactGA.ga('send', 'screenView', { screenName: 'Notifications Page' });
	}

	async componentWillMount() {
		if (!this.props.isNotificationLoaded) {
			await this.getNotifications(null, null);
			this.markAsSeen();
		}
	}

	// Add event listeners after component mounts
	componentDidMount() {
		const { isPopup } = this.props;
		if (isPopup) {
			const scollingArea = document.getElementById('notifications-body');
			scollingArea.addEventListener('scroll', this.handleScroll);
		} else {
			window.addEventListener('scroll', this.handleWindowScroll);
		}
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		const { isPopup } = this.props;
		if (isPopup) {
			const scollingArea = document.getElementById('notifications-body');
			scollingArea.removeEventListener('scroll', this.handleScroll);
		} else {
			window.removeEventListener('scroll', this.handleWindowScroll);
		}
		this.isUnmounted = true;
	}

	handleOpenIfPopup = () => {
		if (this.props.isPopup) { this.props.toggleNotificationsOpen(); }
	}

	getNotifications = async (fromId, toId) => {
		const { getNotifications } = this.props;
		this.setState({ isLoading: true });
		const count = await getNotifications(fromId, toId);
		if (!this.isUnmounted) {
			if (count < 20) {
				this.setState({ fullyLoaded: true });
			} else {
				this.setState({ isLoading: false });
			}
		}
	}

	rednerNotifications = () => this.props.notifications.map(notification => (
		[
			<NotificationItem
				handleOpenIfPopup={this.handleOpenIfPopup}
				key={`notitication${notification.id}`}
				notification={notification}
			/>,
			<Divider key={`divider ${notification.id}`} />,
		]
	))

	// Check scroll state
	handleScroll = () => {
		const { notifications } = this.props;
		const scrollingArea = document.getElementById('notifications-body');
		const neededScrollTop = scrollingArea.scrollHeight - scrollingArea.offsetHeight;
		if (scrollingArea.scrollTop === neededScrollTop && !this.state.fullyLoaded) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.getNotifications(notifications[notifications.length - 1].id, null);
			}
		}
	}

	// Check scroll state
	handleWindowScroll = () => {
		const { notifications } = this.props;
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
			if (!this.state.isLoading && !this.state.fullyLoaded) {
				this.getNotifications(notifications[notifications.length - 1].id, null);
			}
		}
	}

	// Mark notifications as seen
	markAsSeen = () => {
		const { notifications } = this.props;
		Service.request('Profile/MarkNotificationsSeen', { fromId: notifications[0].id });
	}

	render() {
		const { isPopup, isNotificationLoaded } = this.props;
		const bodyStyle = {
			...styles.notificationsBody.base,
			...(isPopup && isNotificationLoaded ? styles.notificationsBody.fixedHeight : {}),
		};
		const bottomLoadingStyle = {
			...styles.bottomLoading.base,
			...(isPopup ? styles.bottomLoading.small : styles.bottomLoading.big),
		};

		if (!isPopup && !isNotificationLoaded) {
			return <LoadingOverlay />;
		}

		return (
			<List id="notifications-body" style={bodyStyle}>
				{
					(!isNotificationLoaded && !this.state.fullyLoaded && isPopup) &&
					<LoadingOverlay size={20} />
				}
				{isNotificationLoaded && this.rednerNotifications()}
				{
					(isNotificationLoaded && !this.state.fullyLoaded) &&
					<div
						className="loading"
						style={
							!this.state.isLoading
								? bottomLoadingStyle
								: [ bottomLoadingStyle, styles.bottomLoading.active ]
						}
					>
						<LoadingOverlay size={isPopup ? 17 : 30} thickness={isPopup ? 2 : 3.5} />
					</div>
				}
			</List>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(NotificationList));
