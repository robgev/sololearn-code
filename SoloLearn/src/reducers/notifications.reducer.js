import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import {
	MARK_READ, MARK_ALL_READ, RESET_LOCALE_DATA, LOGOUT,
	SET_NOTIFICATIONS, EMPTY_NOTIFICATIONS, SET_NOTIFICATION_COUNT,
	REQUEST_NOTIFICATIONS, REFRESH_NOTIFICATIONS, MARK_NOTIFICATIONS_LIST_FINISHED,
} from 'constants/ActionTypes';

const entities = (state = [], action) => {
	switch (action.type) {
	case SET_NOTIFICATIONS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case REFRESH_NOTIFICATIONS:
		return uniqBy([ ...action.payload, ...state ], 'id');
	case MARK_READ:
		return state.map(notification => (action.payload.includes(notification.id)
			? { ...notification, isClicked: true }
			: notification));
	case MARK_ALL_READ:
		return state.map(notification => ({ ...notification, isClicked: true }));
	case EMPTY_NOTIFICATIONS:
	case LOGOUT:
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

const hasMore = (state = true, action) => {
	switch (action.type) {
	case MARK_NOTIFICATIONS_LIST_FINISHED:
		return false;
	case EMPTY_NOTIFICATIONS:
	case RESET_LOCALE_DATA:
		return true;
	default:
		return state;
	}
};

const isFetching = (state = false, action) => {
	switch (action.type) {
	case REQUEST_NOTIFICATIONS:
		return true;
	case SET_NOTIFICATIONS:
	case EMPTY_NOTIFICATIONS:
	case RESET_LOCALE_DATA:
		return false;
	default:
		return state;
	}
};

const count = (state = 0, action) => {
	switch (action.type) {
	case SET_NOTIFICATION_COUNT:
		return action.payload;
	case EMPTY_NOTIFICATIONS:
		return 0;
	default:
		return state;
	}
};

export default combineReducers({
	entities,
	count,
	hasMore,
	isFetching,
});

const notificationsReducer = state => state.notifications;

export const notificationsSelector = createSelector(
	notificationsReducer,
	state => state.entities,
);

export const notificationsCountSelector = createSelector(
	notificationsReducer,
	state => state.count,
);

export const notificationsHasMoreSelector = createSelector(
	notificationsReducer,
	state => state.hasMore,
);

export const isNotificationsFetchingSelector = createSelector(
	notificationsReducer,
	state => state.isFetching,
);
