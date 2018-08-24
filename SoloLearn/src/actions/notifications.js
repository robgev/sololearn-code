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

export const emptyNotifications = () => ({ type: types.EMPTY_NOTIFICATIONS });

export const getNotifications = () =>
	async (dispatch, getState) => {
		// Avoid unnecessary fetches if already fetching
		if (!isNotificationsFetchingSelector(getState())) {
			dispatch({ type: types.REQUEST_NOTIFICATIONS });
			const oldNotifications = notificationsSelector(getState());
			const fromId = oldNotifications.length > 0
				? oldNotifications[oldNotifications.length - 1].id
				: null;
			const fetchCount = 20;
			const [ { count }, { notifications } ] = await Promise.all([
				Service.request('Profile/GetUnseenNotificationCount'),
				Service.request('Profile/GetNotifications', { fromId, count: fetchCount }),
			]);
			if (notifications.length < fetchCount) {
				dispatch({ type: types.MARK_NOTIFICATIONS_LIST_FINISHED });
			}
			const groupedNotifs = groupNotificationItems(notifications);
			dispatch(setNotificationCount(count));
			dispatch({ type: types.SET_NOTIFICATIONS, payload: groupedNotifs });
		}
	};

export const markAllRead = () => ({ type: types.MARK_ALL_READ });

export const markRead = (ids = null) => (dispatch) => {
	if (ids !== null) dispatch({ type: types.MARK_READ, payload: ids });
	else dispatch(markAllRead());
	Service.request('Profile/MarkNotificationsClicked', { ids });
};

export const markAllSeen = () => (_, getState) => {
	const notifications = notificationsSelector(getState());
	if (notifications.length > 0) {
		Service.request('Profile/MarkNotificationsSeen', { fromId: notifications[0].id });
	}
};

export const refreshNotifications = () =>
	async (dispatch, getState) => {
		const oldNotifications = notificationsSelector(getState());
		const toId = oldNotifications.length > 0 ? oldNotifications[0].id : null;
		const [ { count }, { notifications } ] = await Promise.all([
			Service.request('Profile/GetUnseenNotificationCount'),
			Service.request('Profile/GetNotifications', { fromId: null, toId, count: 20 }),
		]);
		const grouped = groupNotificationItems(notifications);
		dispatch(setNotificationCount(count));
		dispatch({ type: types.REFRESH_NOTIFICATIONS, payload: grouped });
		return grouped;
	};
