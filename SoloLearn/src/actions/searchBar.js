import {
	SET_SEARCH_SECTION, SET_SEARCH_VALUE, TOGGLE_SEARCH_BAR,
} from 'constants/ActionTypes';
import { isSearchOpenSelector } from 'reducers/searchBar.reducer';

export const setSearchValue = val => ({
	type: SET_SEARCH_VALUE, payload: val,
});

export const toggleSearch = ({ open } = { open: true }) => (dispatch, getState) => {
	const shouldBeOpen = open === null
		? !isSearchOpenSelector(getState()) // simply flip
		: open; // take the argument as state
	dispatch({ type: TOGGLE_SEARCH_BAR, payload: shouldBeOpen });
};

export const onSearchSectionChange = section => ({
	type: SET_SEARCH_SECTION, payload: section,
});
