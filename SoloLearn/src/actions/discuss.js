import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import {
	discussPostsSelector,
	discussFiltersSelector,
	isDiscussFetchingSelector,
} from 'reducers/discuss.reducer';
import { setSearchValue, toggleSearch, onSearchSectionChange } from 'actions/searchBar';
import { SECTIONS } from 'reducers/searchBar.reducer';

export const removePost = id => (dispatch) => {
	dispatch({
		type: types.REMOVE_POST,
		payload: id,
	});
	return Service.request('Discussion/DeletePost', { id })
		.then((res) => {
			if (res.error) {
				throw res.error;
			}
		});
};

export const getPosts = ({
	count = 20,
} = {}) => async (dispatch, getState) => {
	const stateBefore = getState();
	if (isDiscussFetchingSelector(stateBefore)) {
		return;
	}
	dispatch({ type: types.REQUEST_POSTS });
	const filters = discussFiltersSelector(stateBefore);
	const { length } = discussPostsSelector(stateBefore);
	const { posts, error } = await Service.request('Discussion/Search', {
		index: length, count, ...filters,
	});
	if (error) {
		throw error;
	}
	// Proceed with action only when the filters haven't changed
	// while waiting for the response
	if (filters === discussFiltersSelector(getState())) {
		dispatch({ type: types.SET_POSTS, payload: posts });
		if (posts.length < count) {
			dispatch({ type: types.MARK_DISCUSS_LIST_FINISHED });
		}
	}
};

export const emptyPosts = () => ({
	type: types.EMPTY_POSTS,
});

export const setDiscussFilters = filters => (dispatch, getState) => {
	const oldFilters = discussFiltersSelector(getState());
	const formattedFilters = { ...filters };
	if (filters.orderBy) {
		formattedFilters.orderBy = parseInt(filters.orderBy, 10);
	}
	if (filters.query && filters.query !== oldFilters.query) {
		dispatch(toggleSearch({ open: true }));
		dispatch(setSearchValue(filters.query));
		dispatch(onSearchSectionChange(SECTIONS.posts));
	}
	const keys = Object.keys(formattedFilters);
	if (keys.length === 0 || keys.some(key => formattedFilters[key] !== oldFilters[key])) {
		dispatch({
			type: types.SET_DISCUSS_FILTERS,
			payload: formattedFilters,
		});
		dispatch(emptyPosts());
	}
};

export const getSidebarQuestions = () => async (dispatch) => {
	const { posts } = await Service.request('Discussion/Search', {
		index: 0, query: '', count: 10, orderBy: 10,
	});
	dispatch({ type: types.SET_SIDEBAR_QUESTIONS, payload: posts });
};

export const changeDiscussQuery = (query = '') => ({ type: types.CHANGE_DISCUSS_QUERY, payload: query });
export const changeDiscussOrdering = ordering =>
	({ type: types.CHANGE_DISCUSS_ORDERING, payload: ordering });

// Single post actions that have side effects on list posts

export const removePostFromList = id => ({
	type: types.REMOVE_POST,
	payload: id,
});

export const votePostInList = ({ id, vote, votes }) => ({
	type: types.VOTE_POST,
	payload: { id, vote, votes },
});

export const changePostRepliesCount = ({ id, countChange }) => ({
	type: types.CHANGE_POST_REPLIES_COUNT,
	payload: { id, countChange },
});

export const editPostInList = postInfo => ({
	type: types.EDIT_POST,
	payload: postInfo,
});
