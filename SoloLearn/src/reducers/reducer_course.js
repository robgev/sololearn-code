import { LOAD_COURSE, RESET_LOCALE_DATA, RESET_LOCAL_LESSON } from 'constants/ActionTypes';
import { toSeoFriendly } from 'utils';

export default function (state = null, action) {
	switch (action.type) {
	case LOAD_COURSE:
		return action.payload;
	case RESET_LOCALE_DATA:
	case RESET_LOCAL_LESSON:
		return null;
	default:
		return state;
	}
}

export const isCourseLoaded = (state, alias) => {
	const { course } = state;
	return course !== null && toSeoFriendly(course.alias) === toSeoFriendly(alias);
};
