import { GET_USER_PROFILE, TOGGLE_COURSE } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case GET_USER_PROFILE:
		return action.payload;
	case TOGGLE_COURSE:
		return Object.assign({}, state, {
			skills: action.payload,
		});
	default:
		return state;
	}
}
