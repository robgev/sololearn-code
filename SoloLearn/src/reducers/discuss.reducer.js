import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import {
	SET_POSTS, EMPTY_POSTS, REMOVE_POST, VOTE_POST, SET_SIDEBAR_QUESTIONS,
	MARK_DISCUSS_LIST_FINISHED, REQUEST_POSTS, SET_DISCUSS_FILTERS, LOGOUT,
} from 'constants/ActionTypes';

const isFetching = (state = false, action) => {
	switch (action.type) {
	case REQUEST_POSTS:
		return true;
	case SET_POSTS:
	case EMPTY_POSTS:
	case LOGOUT:
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
	case LOGOUT:
		return true;
	default:
		return state;
	}
};

export const DEFAULT_DISCUSS_FILTERS = { orderBy: 8, query: '' };

const filters = (state = DEFAULT_DISCUSS_FILTERS, action) => {
	switch (action.type) {
	case SET_DISCUSS_FILTERS:
		return { ...DEFAULT_DISCUSS_FILTERS, ...action.payload };
	case LOGOUT:
		return DEFAULT_DISCUSS_FILTERS;
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
	case LOGOUT:
		return [];
	case VOTE_POST:
		// TODO: needs refactoring after Post state becomes local
		/* eslint-disable */
			const {
				vote, isPrimary, votes, id,
			} = action.payload;
			/* eslint-enable */
		if (isPrimary) {
			return state.map(post => (post.id === id
				? { ...post, vote, votes }
				: post));
		}
		return state;
	default:
		return state;
	}
};

const sidebarQuestions = (state = [], action) => {
	switch (action.type) {
	case SET_SIDEBAR_QUESTIONS:
		return action.payload;
	case REMOVE_POST:
		return state.filter(q => q.id !== action.payload);
	default:
		return state;
	}
};

export default combineReducers({
	entities,
	filters,
	hasMore,
	isFetching,
	sidebarQuestions,
});

const discussReducerSelector = state => state.discuss;

export const discussPostsSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.entities,
);

export const sidebarQuestionsSelector = createSelector(
	discussReducerSelector,
	discuss => discuss.sidebarQuestions,
);

export const isDiscussSidebarEmpty = createSelector(
	discussReducerSelector,
	discuss => discuss.sidebarQuestions.length === 0
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
