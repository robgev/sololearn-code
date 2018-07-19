import { GET_USER_PROFILE, UPDATE_PROFILE_DATA, TOGGLE_COURSE } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case GET_USER_PROFILE:
		return action.payload;
	case UPDATE_PROFILE_DATA:
		return { ...state, ...action.payload };
	case TOGGLE_COURSE:
		return Object.assign({}, state, {
			skills: action.payload,
		});
	default:
		return state;
	}
}
