import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getLessonCollections = pagingData => async (dispatch) => {
	try {
		const { collections } = await Service.request('/GetCollections', pagingData);
		dispatch({
			type: types.SET_LESSON_COLLECTIONS,
			payload: collections,
		});
	} catch (e) {
		console.log(e);
	}
};

export const getCollectionItems = (collectionId, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetCollectionItems', { collectionId, ...pagingData });
		dispatch({
			type: types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
	} catch (e) {
		console.log(e);
	}
};

export const searchLessons = (query, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/SearchLessons', { query, ...pagingData });
		dispatch({
			type: types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
	} catch (e) {
		console.log(e);
	}
};

export const getBookmarkLessons = pagingData => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetBookmarkedItems', pagingData);
		dispatch({
			type: types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
	} catch (e) {
		console.log(e);
	}
};

export const getLesson = id => async (dispatch) => {
	try {
		const { lesson } = await Service.request('/GetLesson', { id });
		dispatch({
			type: types.SET_ACTIVE_LESSON,
			payload: lesson,
		});
	} catch (e) {
		console.log(e);
	}
};

export const getCourseLesson = id => async (dispatch) => {
	try {
		const { lesson } = await Service.request('/GetCourseLesson', { id });
		dispatch({
			type: types.SET_ACTIVE_LESSON,
			payload: lesson,
		});
	} catch (e) {
		console.log(e);
	}
};

export const getLessonsByAuthor = (excludeLessonId, userId, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetLessonsByAuthor', { excludeLessonId, userId, ...pagingData });
		dispatch({
			type: types.SET_LESSONS_BY_USER,
			payload: lessons,
		});
	} catch (e) {
		console.log(e);
	}
};
