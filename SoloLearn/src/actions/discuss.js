import last from 'lodash/last';
import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import {
	discussPostsSelector,
	discussFiltersSelector,
	isDiscussFetchingSelector,
	sidebarQuestionsSelector,
} from 'reducers/discuss.reducer';

// Utils
import { toSeoFriendly } from 'utils';

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
	// Avoid unnecessary requests if already fetching
	if (!isDiscussFetchingSelector(stateBefore)) {
		dispatch({ type: types.REQUEST_POSTS });
		const filters = discussFiltersSelector(stateBefore);
		const { length } = discussPostsSelector(stateBefore);
		const { posts, error } = await Service.request('Discussion/Search', {
			index: length, count, ...filters,
		});
		if (error) {
			throw error;
		}
		// Ignore action if filters changed
		if (filters === discussFiltersSelector(getState())) {
			dispatch({ type: types.SET_POSTS, payload: posts });
			if (posts.length < count) {
				dispatch({ type: types.MARK_DISCUSS_LIST_FINISHED });
			}
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
	if (Object.keys(formattedFilters).some(key => formattedFilters[key] !== oldFilters[key])) {
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

// Single post actions

export const loadPost = post => ({
	type: types.LOAD_DISCUSS_POST,
	payload: post,
});

export const loadPostInternal = id => async (dispatch) => {
	const { post, error } = await Service.request('Discussion/GetPost', { id });
	if (error) {
		throw error;
	}
	post.alias = toSeoFriendly(post.title, 100);
	post.replies = [];
	dispatch(loadPost(post));
};

const loadReplies = posts => ({
	type: types.LOAD_DISCUSS_POST_REPLIES,
	payload: posts,
});

const addNewReply = (reply, byVotes) => ({
	type: types.ADD_NEW_REPLY,
	payload: { reply, byVotes },
});

const loadPreviousReplies = posts => ({
	type: types.LOAD_DISCUSS_POST_PREVIOUS_REPLIES,
	payload: posts,
});

const fetchReplies = async ({
	postId, orderBy, index, findPostId, count = 20,
}) => {
	const settings = findPostId ?
		{
			postId, orderBy: 7, findPostId, count,
		} :
		{
			postId, orderBy, index, count,
		};
	const { posts, error } = await Service.request('Discussion/GetReplies', settings);
	if (error) {
		throw error;
	}
	return posts;
};

export const loadPreviousRepliesInternal = orderBy => async (dispatch, getState) => {
	const { discussPost: post } = getState();
	const { index: first } = post.replies[0];
	const index = first >= 20 ? first - 20 : 0;
	const count = index === 0 ? first : 20;
	const posts = await fetchReplies({
		postId: post.id, orderBy, index, count,
	});
	dispatch(loadPreviousReplies(posts));
};

const lastNotForcedDown = (arr) => {
	const notForcedDowns = arr.filter(r => !r.isForcedDown);
	if (!notForcedDowns.length) return -1;
	return last(notForcedDowns).index;
};

export const loadRepliesInternal = (orderBy, findPostId = null) => async (dispatch, getState) => {
	const { discussPost: post } = getState();
	const index = lastNotForcedDown(post.replies) + 1;
	const posts = await fetchReplies({
		postId: post.id, orderBy, index, findPostId,
	});
	dispatch(loadReplies(posts));
	return posts.length;
};

export const emptyReplies = () => ({
	type: types.EMPTY_DISCUSS_POST_REPLIES,
});

const votePost = (id, isPrimary, vote, votes) => ({
	type: types.VOTE_POST,
	payload: {
		id, isPrimary, vote, votes,
	},
});

export const votePostInternal = (post, vote) => (dispatch) => {
	const userVote = post.vote === vote ? 0 : vote;
	const votes = (post.votes + userVote) - post.vote;
	const isPrimary = post.parentID === null;
	dispatch(votePost(post.id, isPrimary, userVote, votes));
	return Service.request('Discussion/VotePost', { id: post.id, vote: userVote });
};

export const editPost = (id, isPrimary, message) => ({
	type: types.EDIT_POST,
	payload: { id, isPrimary, message },
});

export const editPostInternal = (post, message) => {
	const isPrimary = post.parentID === null;
	Service.request('Discussion/EditPost', { id: post.id, message });
	return editPost(post.id, isPrimary, message);
};

export const deletePost = (id, isPrimary) => ({
	type: types.DELETE_POST,
	payload: { id, isPrimary },
});

export const deletePostInternal = (post) => {
	const isPrimary = post.parentID === null;
	return (dispatch) => {
		// dispatch(emptyQuestions());
		if (!isPrimary) {
			dispatch(deletePost(post.id, isPrimary));
			return Service.request('Discussion/DeletePost', { id: post.id });
		}
		return dispatch(removePost(post.id));
	};
};

export const addQuestion = (title, message, tags) => async (dispatch) => {
	const res = await Service.request('Discussion/CreatePost', { title, message, tags });
	const { post } = await Service.request('Discussion/GetPost', { id: res.post.id });
	post.replies = [];
	post.alias = toSeoFriendly(post.title, 100);
	dispatch(loadPost(post));
	return {
		id: post.id,
		alias: post.alias,
	};
};

export const editQuestion = (id, title, message, tags) => (dispatch, getState) => {
	const store = getState();
	const post = store.discussPost;

	return Service.request('Discussion/EditPost', {
		id, title, message, tags,
	}).then((res) => {
		if (res.error) {
			throw res.error;
		}
		post.title = title;
		post.message = message;
		post.tags = tags;
		dispatch(loadPost(post));
		return {
			id: post.id,
			alias: post.alias,
		};
	});
};

export const questionFollowing = isFollowing => ({
	type: types.QUESTION_FOLLOWING,
	payload: isFollowing,
});

export const questionFollowingInternal = (id, isFollowing) => (dispatch) => {
	dispatch(questionFollowing(isFollowing));
	if (isFollowing) {
		Service.request('Discussion/FollowPost', { id });
	} else {
		Service.request('Discussion/UnfollowPost', { id });
	}
};

export const toggleAcceptedAnswer = (id, isAccepted) => ({
	type: types.ACCEPT_ANSWER,
	payload: { id, isAccepted: !isAccepted },
});

export const toggleAcceptedAnswerInternal = (id, isAccepted) => (dispatch) => {
	dispatch(toggleAcceptedAnswer(id, isAccepted));
	Service.request('Discussion/ToggleAcceptedAnswer', { id, accepted: !isAccepted });
};

export const addReply = (postId, message, byVotes) => async (dispatch, getState) => {
	const { userProfile: { name, avatarUrl } } = getState();
	const { post, error } = await Service.request('Discussion/CreateReply', { postId, message });
	if (error) {
		throw error;
	}
	post.userName = name;
	post.vote = 0;
	post.avatarUrl = avatarUrl;
	dispatch(addNewReply(post, byVotes));
	return post.id;
};

export const changeDiscussQuery = (query = '') => ({ type: types.CHANGE_DISCUSS_QUERY, payload: query });
export const changeDiscussOrdering = ordering =>
	({ type: types.CHANGE_DISCUSS_ORDERING, payload: ordering });
