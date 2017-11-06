import { GET_NOTIFICATIONS_COUNT } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case GET_NOTIFICATIONS_COUNT:
		return action.payload;
	default:
		return state;
	}
}
