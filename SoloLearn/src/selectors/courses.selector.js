import { createSelector } from 'reselect';

const getCourses = state => state.courses;

// will add more course selectors, no need to export default
export const getQuizFactoryCourses = // eslint-disable-line import/prefer-default-export
	createSelector(
		getCourses,
		courses => courses
			.filter(course => course.isQuizFactoryEnabled)
			.map(({ id, iconUrl, languageName }) => ({ id, iconUrl, languageName })),
	);
