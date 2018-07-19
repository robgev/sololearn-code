import {
	MARK_READ,
	MARK_ALL_READ,
	RESET_LOCALE_DATA,
	GET_NOTIFICATIONS,
	EMPTY_NOTIFICATIONS,
} from 'constants/ActionTypes';

export default (state = [], action) => {
	switch (action.type) {
	case GET_NOTIFICATIONS:
		return [ ...state, ...action.payload ];
	case MARK_ALL_READ:
		return state.map(notification => ({ ...notification, isClicked: true }));
	case MARK_READ:
		return state.map(notification => (action.payload.includes(notification.id) ?
			{ ...notification, isClicked: true } : notification));
	case EMPTY_NOTIFICATIONS:
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};
