import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Service from 'api/service';
import { getNotifications, emptyNotifications } from 'actions/notifications';
import {
	notificationsSelector,
	notificationsHasMoreSelector,
	isNotificationsFetchingSelector,
} from 'reducers/notifications.reducer';
import NotificationItem from './NotificationItem';
import { List, HorizontalDivider, TextBlock, FlexBox } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';

import './NotificationList.scss';

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

	getNotifications = async () => {
		this.props.getNotifications();
	}

	// Mark notifications as seen
	markAsSeen = () => {
		const { notifications } = this.props;
		if (notifications.length > 0) {
			Service.request('Profile/MarkNotificationsSeen', { fromId: notifications[0].id });
		}
	}

	render() {
		const {
			isPopup, hasMore, notifications, isFetching,
		} = this.props;

		return (
			<List id="notifications-body" className="notifications-list-body fixed-height">
				{
						 <InfiniteScroll
							threshold={100}
							useWindow={!isPopup}
							loadMore={this.getNotifications}
							initialLoad={false}
							hasMore={hasMore}
						>
							{notifications.map(notif => (
								<React.Fragment key={notif.id}>
									<NotificationItem
										handleOpenIfPopup={this.handleOpenIfPopup}
										notification={notif}
									/>
									<HorizontalDivider />
								</React.Fragment>
							))}
        </InfiniteScroll>
				}
						{
							!isFetching && notifications.length === 0
							&& <FlexBox align>
							<TextBlock>
								{this.props.t('common.empty-list-message')}
							</TextBlock>
        </FlexBox>
		}
				
			</List>
		);
	}
}

export default translate()(connect(mapStateToProps, mapDispatchToProps)(NotificationList));
