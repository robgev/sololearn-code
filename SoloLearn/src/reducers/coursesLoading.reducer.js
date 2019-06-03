import { SET_COURSES_LOADING, SET_COURSES_LOADED } from 'constants/ActionTypes';

export default (state = false, action) => {
	switch (action.type) {
	case SET_COURSES_LOADED:
		return false;
	case SET_COURSES_LOADING:
		return true;
	default:
		return state;
	}
};
