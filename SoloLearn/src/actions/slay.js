import Service from 'api/service';
import { slayProgressCollectionsSelector, collectionFetchingSelector } from 'reducers/slay.reducer';
import * as types from 'constants/ActionTypes';

export const getLessonCollections = pagingData => async (dispatch, getState) => {
	try {
		const prevState = getState();
		if (!collectionFetchingSelector(prevState)) {
			dispatch({ type: types.GET_LESSON_COLLECTIONS });
			const { collections } = await Service.request('GetCollections', pagingData);
			dispatch({
				type: types.SET_LESSON_COLLECTIONS,
				payload: collections,
			});
			return collections.length;
		}
	} catch (e) {
		console.log(e);
		return 0;
	}
};

export const refreshLessonCollections = () => async (dispatch, getState) => {
	const progressableCollections = slayProgressCollectionsSelector(getState());
	const collectionsRefreshPromises =
		progressableCollections.map(({ id }) =>
			Service.request(
				'GetCollectionItems',
				{ collectionId: id, index: 0, count: 100 },
				{ id },
			));
	const res = await Promise.all(collectionsRefreshPromises);
	dispatch({
		type:	types.REFRESH_COLLECTIONS_PROGRESS,
		payload: res,
	});
};

export const refreshMyCourses = id => async (dispatch) => {
	const res = await Service.request(
		'GetCollectionItems',
		{ collectionId: id, index: 0, count: 100 },
		{ id },
	);

	dispatch({
		type: types.REFRESH_COLLECTIONS_PROGRESS,
		payload: [ res ],
	});
};

export const getCollectionItems = (collectionId, pagingData) => async (dispatch) => {
	try {
		const { lessons } =
			await Service.request('GetCollectionItems', { collectionId, ...pagingData });
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
			await Service.request('GetCourseAdditionalLessons', {
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
			await Service.request('GetCollection', { id: collectionId });
		dispatch({
			type: types.SET_CURRENT_LESSON_COLLECTION,
			payload: collection || {}, // GetCollection does not return collection if collectionId < 0. remove || {} after fix
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
			await Service.request('SearchLessons', { query, ...pagingData });
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
			await Service.request('GetBookmarkedItems', pagingData);
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

export const toggleLessonBookmark = ({ activeLesson, type, bookmark }) => async (dispatch) => {
	dispatch({
		type: bookmark ?
			types.ADD_BOOKMARK_ITEM :
			types.REMOVE_BOOKMARK_ITEM,
		payload: activeLesson,
	});
	const { isBookmarked } =
		await Service.request('BookmarkLesson', { id: activeLesson.id, type, bookmark });
	return isBookmarked;
};

export const getLesson = id => async (dispatch) => {
	try {
		const { lesson } = await Service.request('GetLesson', { id });
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
		const { lesson } = await Service.request('GetCourseLesson', { id });
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
			await Service.request('GetLessonsByAuthor', { excludeLessonId, userId, ...pagingData });
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

export const unsetCollection = () => ({
	type: types.UNSET_COLLECTION,
});
