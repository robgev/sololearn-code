import { GET_USER_PROFILE, UPDATE_PROFILE_DATA, TOGGLE_COURSE, DEDUCT_EXP, CHANGE_PROGRESS, GET_PROFILE } from 'constants/ActionTypes';
import { createSelector } from 'reselect';

export default (state = null, action) => {
	switch (action.type) {
	case GET_USER_PROFILE:
	case GET_PROFILE:
		return action.payload;
	case UPDATE_PROFILE_DATA:
		return { ...state, ...action.payload };
	case TOGGLE_COURSE:
		return Object.assign({}, state, {
			skills: action.payload,
		});
	case DEDUCT_EXP:
		return { ...state, xp: state.xp - action.payload };
	case CHANGE_PROGRESS:
		const { courseId, progress } = action.payload;
		const { skills } = state;
		const newSkills = [ ...skills ];
		const index = newSkills.findIndex(item => item.id === courseId);
		if (index !== -1) {
			newSkills[index].progress = progress;
		}
		return Object.assign({}, state, {
			skills: newSkills,
		});
	default:
		return state;
	}
};

const userReducer = state => state.userProfile;

export const getUserSelector = createSelector(
	userReducer,
	user => user,
);
