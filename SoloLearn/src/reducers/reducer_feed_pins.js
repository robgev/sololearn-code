import { GET_FEED_PINS, RESET_LOCALE_DATA } from '../constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case GET_FEED_PINS:
		return action.payload;
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
}
