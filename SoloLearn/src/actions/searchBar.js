import {
	SET_SEARCH_SECTION, SET_SEARCH_VALUE, TOGGLE_SEARCH_BAR,
} from 'constants/ActionTypes';

export const onSearchChange = val => ({
	type: SET_SEARCH_VALUE, payload: val,
});

export const toggleSearch = () => ({ type: TOGGLE_SEARCH_BAR });

export const onSearchSectionChange = section => ({
	type: SET_SEARCH_SECTION, payload: section,
});
