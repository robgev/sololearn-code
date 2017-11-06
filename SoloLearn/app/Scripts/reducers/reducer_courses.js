import { LOAD_COURSES } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case LOAD_COURSES:
		return action.payload;
	default:
		return state;
	}
}
