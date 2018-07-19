import { MAP_LESSONS } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case MAP_LESSONS:
		return action.payload;
	default:
		return state;
	}
}
