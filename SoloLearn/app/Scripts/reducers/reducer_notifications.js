import {
	GET_NOTIFICATIONS, MARK_ALL_READ, MARK_READ, EMPTY_NOTIFICATIONS,
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
		return [];
	default:
		return state;
	}
};
