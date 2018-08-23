// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import Divider from 'material-ui/Divider';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

// Service
import Service from 'api/service';

// Redux modules
import { getNotifications, emptyNotifications } from 'actions/notifications';
import {
	notificationsSelector,
	notificationsHasMoreSelector,
	isNotificationsFetchingSelector,
} from 'reducers/notifications.reducer';

// Additional components
import InfiniteScroll from 'react-infinite-scroller';
import NotificationItem from './NotificationItem';

import { NotificationListStyles as styles } from './styles';

const mapStateToProps = state => ({
	notifications: notificationsSelector(state),
	hasMore: notificationsHasMoreSelector(state),
	isFetching: isNotificationsFetchingSelector(state),
});

const mapDispatchToProps = {
	getNotifications,
	emptyNotifications,
};

class NotificationList extends Component {
	async componentDidMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Notifications Page' });
		if (this.props.notifications.length === 0) {
			await this.props.getNotifications();
			this.markAsSeen();
		}
	}

	handleOpenIfPopup = () => {
		if (this.props.isPopup) { this.props.toggleNotificationsOpen(); }
	}

	getNotifications = () => this.props.getNotifications();

	// Mark notifications as seen
	markAsSeen = () => {
		const { notifications } = this.props;
		if (notifications.length > 0) {
			Service.request('Profile/MarkNotificationsSeen', { fromId: notifications[0].id });
		}
	}

	render() {
		const { isPopup, hasMore } = this.props;
		const bodyStyle = {
			...styles.notificationsBody.base,
			...(isPopup ? styles.notificationsBody.fixedHeight : {}),
		};

		return (
			<List id="notifications-body" style={bodyStyle}>
				<InfiniteScroll
					threshold={100}
					loader={<CircularProgress
						key="Infinite loader"
						size={20}
						style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
					/>}
					useWindow={!isPopup}
					loadMore={this.getNotifications}
					initialLoad={false}
					hasMore={hasMore}
					style={{
						display: 'flex',
						width: '100%',
						flexDirection: 'column',
					}}
				>
					{this.props.notifications.map(notif => (
						<React.Fragment key={notif.id}>
							<NotificationItem
								handleOpenIfPopup={this.handleOpenIfPopup}
								notification={notif}
							/>
							<Divider />
						</React.Fragment>
					))}
				</InfiniteScroll>
			</List>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(NotificationList));
