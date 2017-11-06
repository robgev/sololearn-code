import { SET_SHORTCUT_LESSON } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case SET_SHORTCUT_LESSON:
		return action.payload;
	default:
		return state;
	}
}
