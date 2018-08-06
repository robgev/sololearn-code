import { LOAD_COURSES, RESET_LOCALE_DATA } from '../constants/ActionTypes';

const addIconLinks = courses => courses.map(singleCourse => ({
	...singleCourse,
	iconUrl: `https://api.sololearn.com/uploads/Courses/${singleCourse.id}.png`,
}));

export default (state = null, action) => {
	switch (action.type) {
	case LOAD_COURSES:
		return addIconLinks(action.payload);
	case RESET_LOCALE_DATA:
		return null;
	default:
		return state;
	}
};

const coursesReducer = state => state.courses;

export const getCourseByAlias = (state, alias) => {
	const courses = coursesReducer(state);
	return courses.find(c => c.alias === alias);
};
