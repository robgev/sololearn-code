import {
	SET_ACTIVE_LESSON,
	SET_COLLECTION_ITEMS,
	SET_LESSON_COLLECTIONS,
} from 'constants/ActionTypes';
import { combineReducers } from 'redux';

const slayCollections = (state = [], action) => {
	switch (action.type) {
	case SET_LESSON_COLLECTIONS:
		return action.payload;
	default:
		return state;
	}
};

const filteredCollectionItems = (state = [], action) => {
	switch (action.type) {
	case SET_COLLECTION_ITEMS:
		return action.payload;
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

export default combineReducers({
	activeLesson,
	slayCollections,
	filteredCollectionItems,
});
