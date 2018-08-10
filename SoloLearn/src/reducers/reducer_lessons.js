import { MAP_LESSONS } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case MAP_LESSONS:
		return action.payload;
	default:
		return state;
	}
}

export const getLessonByName = (state, name) => {
	const { lessonsMapping } = state;
	if (lessonsMapping === null) {
		return null;
	}
	let res = null;
	Object.values(lessonsMapping).forEach((lesson) => {
		if (lesson.name === name) {
			res = lesson;
		}
	});
	return res;
};
