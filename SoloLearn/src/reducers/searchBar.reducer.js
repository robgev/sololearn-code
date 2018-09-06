import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import {
	SET_SEARCH_SECTION, SET_SEARCH_VALUE, TOGGLE_SEARCH_BAR,
} from 'constants/ActionTypes';

const value = (state = '', action) => {
	switch (action.type) {
	case SET_SEARCH_VALUE:
		return action.payload;
	case TOGGLE_SEARCH_BAR:
		return '';
	default:
		return state;
	}
};

const isOpen = (state = false, action) => {
	switch (action.type) {
	case TOGGLE_SEARCH_BAR:
		return !state;
	default:
		return state;
	}
};

export const SECTIONS = {
	lessons: 'lessons',
	codes: 'codes',
	posts: 'posts',
	users: 'users',
};

const section = (state = SECTIONS.lessons, action) => {
	switch (action.type) {
	case SET_SEARCH_SECTION:
		return action.payload;
	default:
		return state;
	}
};

export default combineReducers({
	value, isOpen, section,
});

const searchBarReducer = state => state.searchBar;

export const searchValueSelector = createSelector(
	searchBarReducer,
	search => search.value,
);

export const searchSectionSelector = createSelector(
	searchBarReducer,
	search => search.section,
);

export const isSearchOpenSelector = createSelector(
	searchBarReducer,
	search => search.isOpen,
);
