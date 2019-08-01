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
		if (action.noDropCourses) return state;
		return [];
	default:
		return state;
	}
};

export const getCoursesReducer = state => state.courses;

export const getCourseByAlias = (state, alias) => {
	if (state.course && toSeoFriendly(state.course.alias) === toSeoFriendly(alias)) {
		return state.course;
	}
	const courses = getCoursesReducer(state);
	const res = courses.find(c => toSeoFriendly(c.alias) === toSeoFriendly(alias));
	return res;
};

export const getCourseAliasById = (courses, id) => {
	const course = courses.find(course => course.id === id);
	return course ? course.alias : '';
};
