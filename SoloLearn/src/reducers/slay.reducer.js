import {
	SET_ACTIVE_LESSON,
	RESET_LOCALE_DATA,
	SET_LESSONS_BY_USER,
	ADD_BOOKMARK_ITEM,
	SET_COLLECTION_ITEMS,
	SET_LESSON_COLLECTIONS,
	REMOVE_BOOKMARK_ITEM,
	APPEND_LESSONS_BY_USER,
	APPEND_COLLECTION_ITEMS,
	REFRESH_COLLECTIONS_PROGRESS,
	SET_CURRENT_LESSON_COLLECTION,
	SET_BOOKMARK_COLLECTION_ITEMS,
	APPEND_BOOKMARK_COLLECTION_ITEMS,
} from 'constants/ActionTypes';
import uniqBy from 'lodash/uniqBy';
import map from 'lodash/map';
import keyBy from 'lodash/keyBy';
import { combineReducers } from 'redux';

const refreshCollections = (currentCollections, changedCollections) => {
	// Done for accessing by id, see line 26
	const changedCollectionsHashmap = keyBy(changedCollections, 'id');
	const changedIds = map(changedCollections, 'id');
	console.log(currentCollections, changedCollectionsHashmap, changedIds);
	return currentCollections.map(c =>
		(changedIds.includes(c.id)
			? { ...c, items: changedCollectionsHashmap[c.id].lessons }
			: c));
};

const slayCollections = (state = [], action) => {
	switch (action.type) {
	case SET_LESSON_COLLECTIONS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case REFRESH_COLLECTIONS_PROGRESS:
		return refreshCollections(state, action.payload);
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

const selectedCollection = (state = null, action) => {
	switch (action.type) {
	case SET_CURRENT_LESSON_COLLECTION:
		return action.payload;
	case RESET_LOCALE_DATA:
		return null;
	default:
		return state;
	}
};

const filteredCollectionItems = (state = [], action) => {
	switch (action.type) {
	case SET_COLLECTION_ITEMS:
		return action.payload;
	case APPEND_COLLECTION_ITEMS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

const bookmarks = (state = [], action) => {
	switch (action.type) {
	case SET_BOOKMARK_COLLECTION_ITEMS:
		return action.payload;
	case APPEND_BOOKMARK_COLLECTION_ITEMS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case ADD_BOOKMARK_ITEM:
		return [ action.payload, ...state ];
	case REMOVE_BOOKMARK_ITEM:
		return state.filter(l => l.id !== action.payload.id);
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

const activeLesson = (state = null, action) => {
	switch (action.type) {
	case SET_ACTIVE_LESSON:
		return action.payload;
	case RESET_LOCALE_DATA:
		return null;
	default:
		return state;
	}
};

const lessonsByUser = (state = [], action) => {
	switch (action.type) {
	case SET_LESSONS_BY_USER:
		return action.payload;
	case APPEND_LESSONS_BY_USER:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

export const slaySelector = state => state.slay;
export const slayCollectionsSelector = state =>
	slaySelector(state).slayCollections;
// 2 is course collections, 4 is track collections
export const slayProgressCollectionsSelector = state =>
	slayCollectionsSelector(state).filter(c => c.type === 2 || c.type === 4);

export default combineReducers({
	bookmarks,
	activeLesson,
	lessonsByUser,
	slayCollections,
	selectedCollection,
	filteredCollectionItems,
});
