import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import {
	SET_POSTS, EMPTY_POSTS, REMOVE_POST,
	DISCUSS_ORDER_BY_FILTER_CHANGE, DISCUSS_QUERY_FILTER_CHANGE,
	MARK_DISCUSS_LIST_FINISHED, REQUEST_POSTS,
} from 'constants/ActionTypes';

const isFetching = (state = false, action) => {
	switch (action.type) {
	case REQUEST_POSTS:
		return true;
  case SET_POSTS:
  case EMPTY_POSTS:
		return false;
	default:
		return state;
	}
};

const hasMore = (state = true, action) => {
	switch (action.type) {
	case MARK_DISCUSS_LIST_FINISHED:
		return false;
	case EMPTY_POSTS:
		return true;
	default:
		return state;
	}
};

const filters = (state = { orderBy: 8, query: '' }, action) => {
	switch (action.type) {
	case DISCUSS_ORDER_BY_FILTER_CHANGE:
		return { ...state, orderBy: action.payload };
	case DISCUSS_QUERY_FILTER_CHANGE:
		return { ...state, query: action.payload };
	default:
		return state;
	}
};

const entities = (state = [], action) => {
	switch (action.type) {
	case SET_POSTS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case REMOVE_POST:
		return state.filter(question => question.id !== action.payload);
	case EMPTY_POSTS:
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
});

const discussReducerSelector = state => state.discuss;

export const discussPostsSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.entities,
);

export const discussFiltersSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.filters,
);

export const discussHasMoreSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.hasMore,
);

export const isDiscussFetchingSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.isFetching,
);
