import { LOAD_COURSES, RESET_LOCALE_DATA } from 'constants/ActionTypes';
import { toSeoFriendly } from 'utils';
import { AppDefaults } from 'api/service';

const addIconLinks = courses => courses.map(singleCourse => ({
	...singleCourse,
	iconUrl: `${AppDefaults.downloadHost}/Courses/${singleCourse.id}.png`,
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

export const getCourseByCourseName = (state, courseName) => {
	if (state.course && toSeoFriendly(state.course.name) === toSeoFriendly(courseName)) {
		return state.course;
	}
	const courses = getCoursesReducer(state);
	const res = courses.find(c => toSeoFriendly(c.name) === toSeoFriendly(courseName));
	return res;
};
