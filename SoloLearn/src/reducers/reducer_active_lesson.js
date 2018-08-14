import { LESSON_SELECTED } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case LESSON_SELECTED:
		return action.payload;
	default:
		return state;
	}
}
