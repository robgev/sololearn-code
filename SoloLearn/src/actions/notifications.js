import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { isNotificationsFetchingSelector, notificationsSelector } from 'reducers/notifications.reducer';

const groupNotificationItems = (notifications) => {
	const groupedNotifications = [];
	let temp = notifications;
	while (temp.length > 0) {
		const firstItem = temp[0];
		temp.splice(0, 1);
		const groupedItems = temp.filter(item => item.groupID === firstItem.groupID);
		temp = temp.filter(item => item.groupID !== firstItem.groupID);
		firstItem.groupedItems = groupedItems;
		groupedNotifications.push(firstItem);
	}
	return groupedNotifications;
};

export const setNotificationCount = count => ({
	type: types.SET_NOTIFICATION_COUNT,
	payload: count,
});

export const getNotificationCount = () => async (dispatch) => {
	const { count } = await Service.request('Profile/GetUnseenNotificationCount');
	dispatch(setNotificationCount(count));
};

export const emptyNotifications = () => ({ type: types.EMPTY_NOTIFICATIONS });

export const getNotifications = ({ fromId = null, toId = null, count = 20 } = {}) =>
	async (dispatch, getState) => {
		// Avoid unnecessary fetches if already fetching
		if (!isNotificationsFetchingSelector(getState())) {
			dispatch({ type: types.REQUEST_NOTIFICATIONS });
			const oldNotifications = notificationsSelector(getState());
			const { notifications } = await Service.request(
				'Profile/GetNotifications',
				{
					fromId: fromId === null && oldNotifications.length > 0
						? oldNotifications[oldNotifications.length - 1].id
						: null,
					toId,
					count,
				},
			);
			if (notifications.length < count) {
				dispatch({ type: types.MARK_NOTIFICATIONS_LIST_FINISHED });
			}
			const groupedNotifs = groupNotificationItems(notifications);
			dispatch({ type: types.SET_NOTIFICATIONS, payload: groupedNotifs });
		}
	};

export const markAllRead = () => ({ type: types.MARK_ALL_READ });

export const markRead = (ids = null) => (dispatch) => {
	if (ids !== null) dispatch({ type: types.MARK_READ, payload: ids });
	else dispatch(markAllRead());
	Service.request('Profile/MarkNotificationsClicked', { ids });
};
