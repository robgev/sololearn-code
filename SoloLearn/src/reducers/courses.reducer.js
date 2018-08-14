import { LOAD_COURSES, RESET_LOCALE_DATA } from 'constants/ActionTypes';

const addIconLinks = courses => courses.map(singleCourse => ({
	...singleCourse,
	iconUrl: `https://api.sololearn.com/uploads/Courses/${singleCourse.id}.png`,
}));

export default (state = [], action) => {
	switch (action.type) {
	case LOAD_COURSES:
		return addIconLinks(action.payload);
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

export const getCoursesReducer = state => state.courses;

export const getCourseByLanguage = (state, language) => {
	if (state.course) {
		return state.course;
	}
	const courses = getCoursesReducer(state);
	return courses.find(c => c.language === language);
};