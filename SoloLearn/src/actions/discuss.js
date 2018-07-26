import { toast } from 'react-toastify';
import { last } from 'lodash';
import Service from 'api/service';
import * as types from 'constants/ActionTypes';

// Utils
import { toSeoFriendly, showError } from 'utils';

export const emptyQuestions = () => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.EMPTY_QUESTIONS,
		payload: [],
	});
	resolve();
});

export const getQuestions = questions => ({
	type: types.GET_QUESTIONS,
	payload: questions,
});

export const changeDiscussHasMore = hasMore =>
	({ type: types.CHANGE_DISCUSS_HAS_MORE, payload: hasMore });

export const getQuestionsInternal = ({
	index, query, orderBy,
}) => async (dispatch, getState) => {
	const settings = {
		index,
		count: 20,
		orderBy,
		query,
	};
	const { posts } = await Service.request('Discussion/Search', settings);
	const { order, tag } = getState().discussFilters;
	if (order === orderBy && tag === query) {
		dispatch(getQuestions(posts));
		if (posts.length === 0) {
			dispatch(changeDiscussHasMore(false));
		}
	}
};

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

const votePost = (id, isPrimary, vote, votes) => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.VOTE_POST,
		payload: {
			id, isPrimary, vote, votes,
		},
	});
	resolve();
});

export const votePostInternal = (post, vote) => {
	const userVote = post.vote === vote ? 0 : vote;
	const votes = (post.votes + userVote) - post.vote;
	const isPrimary = post.parentID === null;

	return async (dispatch) => {
		try {
			await dispatch(votePost(post.id, isPrimary, userVote, votes));
			const res = Service.request('Discussion/VotePost', { id: post.id, vote: userVote });
			if (res && res.error) {
				showError(res.error.data);
			}
		} catch (e) {
			toast.error(`❌Something went wrong when trying to vote: ${e.message}`);
		}
	};
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

export const deletePost = (id, isPrimary) => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.DELETE_POST,
		payload: { id, isPrimary },
	});
	resolve();
});

export const deletePostInternal = (post) => {
	const isPrimary = post.parentID === null;
	return (dispatch) => {
		dispatch(emptyQuestions());
		if (!isPrimary) {
			return dispatch(deletePost(post.id, isPrimary)).then(() => {
				Service.request('Discussion/DeletePost', { id: post.id });
			});
		}
		return Service.request('Discussion/DeletePost', { id: post.id }).then((res) => {
			if (res.error) {
				throw res.error;
			}
			dispatch(loadPost(null));
		});
	};
};

export const addQuestion = (title, message, tags) => async (dispatch) => {
	const res = await Service.request('Discussion/CreatePost', { title, message, tags });
	if (res.error) {
		throw res.error;
	}
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
