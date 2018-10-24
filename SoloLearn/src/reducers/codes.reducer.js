import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import {
	SET_SIDEBAR_CODES, SET_CODES, EMPTY_CODES, REMOVE_CODE, LOGOUT,
	SET_CODES_FILTERS, MARK_CODES_LIST_FINISHED, REQUEST_CODES,
} from 'constants/ActionTypes';

const isFetching = (state = false, action) => {
	switch (action.type) {
	case REQUEST_CODES:
		return true;
	case SET_CODES:
	case EMPTY_CODES:
	case LOGOUT:
		return false;
	default:
		return state;
	}
};

const hasMore = (state = true, action) => {
	switch (action.type) {
	case MARK_CODES_LIST_FINISHED:
		return false;
	case EMPTY_CODES:
	case LOGOUT:
		return true;
	default:
		return state;
	}
};

export const DEFAULT_CODES_FILTERS = { orderBy: 6, language: '', query: '' };

const filters = (state = DEFAULT_CODES_FILTERS, action) => {
	switch (action.type) {
	case SET_CODES_FILTERS:
		return action.payload;
	case LOGOUT:
		return DEFAULT_CODES_FILTERS;
	default:
		return state;
	}
};

const entities = (state = [], action) => {
	switch (action.type) {
	case SET_CODES:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case REMOVE_CODE:
		return state.filter(code => code.id !== action.payload);
	case EMPTY_CODES:
	case LOGOUT:
		return [];
	default:
		return state;
	}
};

const sidebarCodes = (state = null, action) => {
	switch (action.type) {
	case SET_SIDEBAR_CODES:
		return action.payload;
	case REMOVE_CODE:
		return state.filter(code => code.id !== action.payload);
	case LOGOUT:
		return [];
	default:
		return state;
	}
};

export default combineReducers({
	entities,
	filters,
	hasMore,
	isFetching,
	sidebarCodes,
});

const codesReducerSelector = state => state.codes;

export const codesSelector = createSelector(
	codesReducerSelector,
	codes => codes.entities,
);

export const sidebarCodesSelector = createSelector(
	codesReducerSelector,
	codes => codes.sidebarCodes,
);

export const codesFiltersSelector = createSelector(
	codesReducerSelector,
	codes => codes.filters,
);

export const codesHasMoreSelector = createSelector(
	codesReducerSelector,
	codes => codes.hasMore,
);

export const isCodesFetchingSelector = createSelector(
	codesReducerSelector,
	codes => codes.isFetching,
);
