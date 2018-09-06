import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import {
	codesSelector,
	codesFiltersSelector,
	isCodesFetchingSelector,
} from 'reducers/codes.reducer';
import { setSearchValue, toggleSearch, onSearchSectionChange } from 'actions/searchBar';
import { SECTIONS } from 'reducers/searchBar.reducer';

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
	query = '', count = 20,
} = {}) => async (dispatch, getState) => {
	const stateBefore = getState();
	// Avoid unnecessary requests if already fetching
	if (!isCodesFetchingSelector(stateBefore)) {
		dispatch({ type: types.REQUEST_CODES });
		const filters = codesFiltersSelector(stateBefore);
		const { length } = codesSelector(stateBefore);
		const { codes } = await Service.request('Playground/GetPublicCodes', {
			index: length, query, count, ...filters,
		});
		// Ignore action if filters changed
		if (filters === codesFiltersSelector(getState())) {
			dispatch({ type: types.SET_CODES, payload: codes });
			if (codes.length < count) {
				dispatch({ type: types.MARK_CODES_LIST_FINISHED });
			}
		}
	}
};

export const getSidebarCodes = () => async (dispatch) => {
	const { codes } = await Service.request('Playground/GetPublicCodes', {
		index: 0, query: '', count: 10, orderBy: 3, language: '',
	});
	dispatch({ type: types.SET_SIDEBAR_CODES, payload: codes });
};

export const setCodesFilters = filters => (dispatch, getState) => {
	const oldFilters = codesFiltersSelector(getState());
	const formattedFilters = { ...filters };
	if (filters.orderBy) {
		formattedFilters.orderBy = parseInt(filters.orderBy, 10);
	}
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
