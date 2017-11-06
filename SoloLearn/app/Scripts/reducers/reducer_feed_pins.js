import { GET_FEED_PINS } from '../constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case GET_FEED_PINS:
		return action.payload;
	default:
		return state;
	}
}
