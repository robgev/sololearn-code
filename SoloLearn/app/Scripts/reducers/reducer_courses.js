import { LOAD_COURSES } from '../constants/ActionTypes';

const addIconLinks = courses => courses.map(singleCourse => ({
	...singleCourse,
	iconUrl: `https://api.sololearn.com/uploads/Courses/${singleCourse.id}.png`,
}));

export default (state = null, action) => {
	switch (action.type) {
	case LOAD_COURSES:
		return addIconLinks(action.payload);
	default:
		return state;
	}
};
