import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import {
	codesSelector,
	codesFiltersSelector,
	isCodesFetchingSelector,
} from 'reducers/codes.reducer';
import { setSearchValue, toggleSearch, onSearchSectionChange } from 'actions/searchBar';
import { SECTIONS } from 'reducers/searchBar.reducer';

import codeFilters from 'defaults/codeFilters';

export const removeCode = id => (dispatch) => {
	dispatch({
		type: types.REMOVE_CODE,
		payload: id,
	});
	return Service.request('Playground/DeleteCode', { id })
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
		});
};

export const emptyCodes = () => ({
	type: types.EMPTY_CODES,
});

export const getCodes = ({
	query = '', count = 20, forceRefresh,
} = {}) => async (dispatch, getState) => {
	const stateBefore = getState();
	// Avoid unnecessary requests if already fetching
	if (!isCodesFetchingSelector(stateBefore)) {
		dispatch({ type: types.REQUEST_CODES });
		const filters = codesFiltersSelector(stateBefore);
		const { length } = codesSelector(stateBefore);
		const index = forceRefresh ? 0 : length; // Update the list when entering the page
		const { codes } = await Service.request('Playground/GetPublicCodes', {
			index, query, count, ...filters, orderBy: codeFilters[filters.ordering],
		});
		// Ignore action if filters changed
		if (filters === codesFiltersSelector(getState())) {
			const actionType = forceRefresh ? types.REFRESH_CODES : types.SET_CODES;
			dispatch({ type: actionType, payload: codes });
			if (codes.length < count) {
				dispatch({ type: types.MARK_CODES_LIST_FINISHED });
			}
		}
	}
};

export const getSidebarCodes = () => async (dispatch) => {
	const { codes } = await Service.request('Playground/GetPublicCodes', {
		index: 0, query: '', count: 10, ordering: 3, language: '',
	});
	dispatch({ type: types.SET_SIDEBAR_CODES, payload: codes });
};

export const setCodesFilters = filters => (dispatch, getState) => {
	const oldFilters = codesFiltersSelector(getState());
	const formattedFilters = { ...filters };
	if (filters.query && filters.query !== oldFilters.query) {
		dispatch(toggleSearch({ open: true }));
		dispatch(setSearchValue(filters.query));
		dispatch(onSearchSectionChange(SECTIONS.codes));
	}
	const keys = Object.keys(formattedFilters);
	if (keys.length === 0 || keys.some(key => formattedFilters[key] !== oldFilters[key])) {
		dispatch({
			type: types.SET_CODES_FILTERS,
			payload: formattedFilters,
		});
		dispatch(emptyCodes());
	}
};
