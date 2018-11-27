import { LOAD_COURSE, RESET_LOCALE_DATA } from 'constants/ActionTypes';
import { toSeoFriendly } from 'utils';

export default function (state = null, action) {
	switch (action.type) {
	case LOAD_COURSE:
		return action.payload;
	case RESET_LOCALE_DATA:
		return null;
	default:
		return state;
	}
}

export const isCourseLoaded = (state, courseName) => {
	const { course } = state;
	console.warn(course, courseName);
	return course !== null && toSeoFriendly(course.name) === toSeoFriendly(courseName);
};
