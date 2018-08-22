import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getLessonCollections = pagingData => async (dispatch) => {
	try {
		const { collections } = await Service.request('/GetCollections', pagingData);
		dispatch({
			type: types.SET_LESSON_COLLECTIONS,
			payload: collections,
		});
		return collections.length;
	} catch (e) {
		console.log(e);
		return 0;
	}
};

export const getCollectionItems = (collectionId, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetCollectionItems', { collectionId, ...pagingData });
		dispatch({
			type: pagingData.index ?
				types.APPEND_COLLECTION_ITEMS :
				types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
		return lessons.length;
	} catch (e) {
		console.log(e);
		return 0;
	}
};

export const getMoreOnTopic = ({
	courseId,
	query = '',
	index,
	count,
}) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetCourseAdditionalLessons', {
				courseId,
				query,
				index,
				count,
			});
		dispatch({
			type: index ?
				types.APPEND_COLLECTION_ITEMS :
				types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
		return lessons.length;
	} catch (e) {
		console.log(e);
		return 0;
	}
};

export const setSelectedCollection = collectionId => async (dispatch, getState) => {
	const { slayCollections } = getState().slay;
	const currentCollection = !slayCollections.length ?
		null :
		slayCollections.find(c => c.id === collectionId);
	if (!currentCollection) {
		const { collection } =
			await Service.request('/GetCollection', { id: collectionId });
		dispatch({
			type: types.SET_CURRENT_LESSON_COLLECTION,
			payload: collection,
		});
	} else {
		dispatch({
			type: types.SET_CURRENT_LESSON_COLLECTION,
			payload: currentCollection,
		});
	}
};

export const searchLessons = (query, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/SearchLessons', { query, ...pagingData });
		dispatch({
			type: pagingData.index ?
				types.APPEND_COLLECTION_ITEMS :
				types.SET_COLLECTION_ITEMS,
			payload: lessons,
		});
		// We return this to know if there are more items
		// That can be loaded later.
		// Check out Learn/SlaySearch or SlayDetailed
		return lessons.length;
	} catch (e) {
		console.log(e);
		return 0;
	}
};

export const getBookmarkLessons = pagingData => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('/GetBookmarkedItems', pagingData);
		dispatch({
			type: pagingData.index ?
				types.APPEND_BOOKMARK_COLLECTION_ITEMS :
				types.SET_BOOKMARK_COLLECTION_ITEMS,
			payload: lessons,
		});
		return lessons.length;
	} catch (e) {
		console.log(e);
		return 0;
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
			type: pagingData.index ?
				types.APPEND_LESSONS_BY_USER :
				types.SET_LESSONS_BY_USER,
			payload: lessons,
		});
		return lessons.length;
	} catch (e) {
		console.log(e);
		return 0;
	}
};
