import { GET_NOTIFICATIONS, MARK_ALL_READ, MARK_READ, EMPTY_NOTIFICATIONS } from '../constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case GET_NOTIFICATIONS:
		return state.concat(action.payload);
	case MARK_ALL_READ:
		return state.map(notification => (!notification.isClicked ?
			{ ...notification, isClicked: true } : notification));
	case MARK_READ:
		return state.map(notification => (action.payload.includes(notification.id) ?
			{ ...notification, isClicked: true } : notification));
	case EMPTY_NOTIFICATIONS:
		return action.payload;
	default:
		return state;
	}
}
