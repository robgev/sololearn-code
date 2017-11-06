// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

// Service
import Service from '../../api/service';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNotificationsInternal, emptyNotifications } from 'actions/profile';
import { isLoaded, defaultsLoaded } from 'reducers';

// Additional components
import LoadingOverlay from '../../components/Shared/LoadingOverlay';
import NotificationItem from './NotificationItem';

// Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';

// Utils
import getStyles from '../../utils/styleConverter';

const styles = {
	notificationsContainer: {
		position: 'absolute',
		backgroundColor: '#fff',
		width: '400px',
		top: '20px',
		right: 0,
	},

	notificationsTitle: {
		padding: '11px 14px',
		fontSize: '13px',
		fontWeight: 500,
	},

	notificationsBody: {
		base: {
			position: 'relative',
			padding: 0,
			minHeight: '50px',
		},

		fixedHeight: {
			height: '400px',
			overflowY: 'scroll',
		},
	},

	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},

		small: {
			height: '30px',
		},

		big: {
			height: '50px',
		},

		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},

	notificationsFooter: {
		padding: '8px 12px',
		textAlign: 'center',
	},

	notificationsFooterButton: {
		fontSize: '13px',
		fontWeight: 500,
		textDecoration: 'none',
		color: '#607d8b',

		':hover': {
			textDecoration: 'underline',
		},
	},

};

class NotificationList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			fullyLoaded: false,
		};

		this.isUnmounted = false;

		this.handleScroll = this.handleScroll.bind(this);
		this.handleWindowScroll = this.handleWindowScroll.bind(this);
	}

    handleOpenIfPopup = () => {
    	if (this.props.isPopup) { this.props.toggleNotificationsOpen(); }
    }

    // Get post answers
    getNotifications(fromId, toId) {
    	if (!this.isUnmounted) {
    		this.setState({ isLoading: true });

    		return this.props.getNotifications(fromId, toId).then((count) => {
    			if (count < 20) {
    				!this.isUnmounted && this.setState({ fullyLoaded: true });
    			}

    			!this.isUnmounted && this.setState({ isLoading: false });
    		}).catch((error) => {
    			console.log(error);
    		});
    	}
    }

    rednerNotifications() {
    	return this.props.notifications.map((notification, index) => (
    		[ <NotificationItem
    			handleOpenIfPopup={this.handleOpenIfPopup}
    			key={`notitication${notification.id}`}
	notification={notification}
    		/>,
	<Divider key={`divider ${notification.id}`} /> ]
    	));
    }

    // Check scroll state
    handleScroll() {
    	const scollingArea = document.getElementById('notifications-body');
    	if (scollingArea.scrollTop === (scollingArea.scrollHeight - scollingArea.offsetHeight) && !this.state.fullyLoaded) {
    		if (!this.state.isLoading && !this.state.fullyLoaded) {
    			this.getNotifications(this.props.notifications[this.props.notifications.length - 1].id, null);
    		}
    	}
    }

    // Check scroll state
    handleWindowScroll() {
    	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    		if (!this.state.isLoading && !this.state.fullyLoaded) {
    			this.getNotifications(this.props.notifications[this.props.notifications.length - 1].id, null);
    		}
    	}
    }

    // Mark notifications as seen
    markAsSeen = () => {
    	if (!this.isUnmounted) {
    		const notifications = this.props.notifications;

    		Service.request('Profile/MarkNotificationsSeen', { fromId: notifications[0].id });
    	}
    }

    render() {
    	const isPopup = this.props.isPopup;
    	const bodyStyle = !isPopup ? styles.notificationsBody.base : (!this.props.isLoaded ? styles.notificationsBody.base : getStyles(styles.notificationsBody.base, styles.notificationsBody.fixedHeight));
    	const bottomLoadingStyle = isPopup ? getStyles(styles.bottomLoading.base, styles.bottomLoading.small) : getStyles(styles.bottomLoading.base, styles.bottomLoading.big);

    	if (!isPopup && !this.props.isLoaded) {
    		return <LoadingOverlay />;
    	}

    	return (
    		<List id="notifications-body" style={bodyStyle}>
    			{(!this.props.isLoaded && !this.state.fullyLoaded && isPopup) && <LoadingOverlay size={20} />}
    			{this.props.isLoaded && this.rednerNotifications()}
    			{
    				(this.props.isLoaded && !this.state.fullyLoaded) &&
    <div className="loading" style={!this.state.isLoading ? bottomLoadingStyle : [ bottomLoadingStyle, styles.bottomLoading.active ]}>
    	<LoadingOverlay size={isPopup ? 17 : 30} thickness={isPopup ? 2 : 3.5} />
    </div>
    			}
	</List>
    	);
    }

    componentWillMount() {
    	if (this.props.isPopup) {
    		this.getNotifications(null, null).then(() => {
    			this.markAsSeen();
    		});
    	} else if (!this.props.isLoaded) {
    		this.getNotifications(null, null).then(() => {
    		this.markAsSeen();
    	});
    	}
    }

    // Add event listeners after component mounts
    componentDidMount() {
    	if (this.props.isPopup) {
    		const scollingArea = document.getElementById('notifications-body');
    		scollingArea.addEventListener('scroll', this.handleScroll);
    	} else {
    		window.addEventListener('scroll', this.handleWindowScroll);
    	}
    }

    // Remove event listeners after component unmounts
    componentWillUnmount() {
    	if (this.props.isPopup) {
    		const scollingArea = document.getElementById('notifications-body');
    		scollingArea.removeEventListener('scroll', this.handleScroll);
    	} else {
    		window.removeEventListener('scroll', this.handleWindowScroll);
    	}

    	this.isUnmounted = true;
    }
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'notifications'),
		notifications: state.notifications,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getNotifications: getNotificationsInternal,
		emptyNotifications,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(NotificationList));
