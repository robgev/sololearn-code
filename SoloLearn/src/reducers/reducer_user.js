import { GET_USER_PROFILE, UPDATE_PROFILE_DATA, TOGGLE_COURSE, DEDUCT_EXP } from 'constants/ActionTypes';
import { createSelector } from 'reselect';

export default (state = null, action) => {
	switch (action.type) {
	case GET_USER_PROFILE:
		return action.payload;
	case UPDATE_PROFILE_DATA:
		return { ...state, ...action.payload };
	case TOGGLE_COURSE:
		return Object.assign({}, state, {
			skills: action.payload,
		});
	case DEDUCT_EXP:
		return { ...state, xp: state.xp - action.payload };
	default:
		return state;
	}
};

const userReducer = state => state.userProfile;

export const getUserSelector = createSelector(
	userReducer,
	user => user,
);
