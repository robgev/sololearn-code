import {
	SET_ACTIVE_LESSON,
	SET_LESSONS_BY_USER,
	SET_COLLECTION_ITEMS,
	SET_LESSON_COLLECTIONS,
	APPEND_COLLECTION_ITEMS,
} from 'constants/ActionTypes';
import { differenceBy } from 'lodash';
import { combineReducers } from 'redux';

const safeAdd = (oldList, newList) => {
	const appendedArticles = differenceBy(newList, oldList, 'id');
	return [ ...oldList, ...appendedArticles ];
};

const slayCollections = (state = [], action) => {
	switch (action.type) {
	case SET_LESSON_COLLECTIONS:
		return safeAdd(state, action.payload);
	default:
		return state;
	}
};

const filteredCollectionItems = (state = [], action) => {
	switch (action.type) {
	case SET_COLLECTION_ITEMS:
		return action.payload;
	case APPEND_COLLECTION_ITEMS:
		return safeAdd(state, action.payload);
	default:
		return state;
	}
};

const activeLesson = (state = null, action) => {
	switch (action.type) {
	case SET_ACTIVE_LESSON:
		return action.payload;
	default:
		return state;
	}
};

const lessonsByUser = (state = [], action) => {
	switch (action.type) {
	case SET_LESSONS_BY_USER:
		return action.payload;
	default:
		return state;
	}
};

export default combineReducers({
	activeLesson,
	lessonsByUser,
	slayCollections,
	filteredCollectionItems,
});
