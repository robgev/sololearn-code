import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { changeLoginModal } from './login.action';

// Utils
import { toSeoFrendly } from 'utils';

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

export const getProfileQuestions = questions => ({
	type: types.GET_PROFILE_QUESTIONS,
	payload: questions,
});

export const getQuestionsInternal = ({
	index, profileId = null, count = 20, query = '', ordering,
}) => async (dispatch) => {
	const orderBy = profileId != null ? 7 : ordering;
	const settings = {
		index,
		count,
		orderBy,
		profileId,
		query,
	};
	const { posts: questions } = await Service.request('Discussion/Search', settings);
	if (profileId != null) {
		dispatch(getProfileQuestions(questions));
	} else {
		dispatch(getQuestions(questions));
	}
	return questions.length;
};

export const loadPost = post => ({
	type: types.LOAD_DISCUSS_POST,
	payload: post,
});

export const loadPostInternal = id => async (dispatch) => {
	try {
		const { post } = await Service.request('Discussion/GetPost', { id });
		post.alias = toSeoFrendly(post.title, 100);
		post.replies = [];
		dispatch(loadPost(post));
	} catch (e) {
		console.log(e);
	}
};

const loadReplies = posts => ({
	type: types.LOAD_DISCUSS_POST_REPLIES,
	payload: posts,
});

const loadPreviousReplies = posts => ({
	type: types.LOAD_DISCUSS_POST_PREVIOUS_REPLIES,
	payload: posts,
});

const fetchReplies = async ({
	postId, orderBy, index, findPostId, count = 20,
}) => {
	try {
		const settings = findPostId ?
			{
				postId, orderBy: 7, findPostId, count,
			} :
			{
				postId, orderBy, index, count,
			};
		const { posts } = await Service.request('Discussion/GetReplies', settings);
		return posts;
	} catch (e) {
		return console.log(e);
	}
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

export const loadRepliesInternal = (orderBy, answerId) => async (dispatch, getState) => {
	const { discussPost: post } = getState();
	const posts = await fetchReplies({
		postId: post.id, orderBy, index: post.replies.length, findPostId: answerId || null,
	});
	dispatch(loadReplies(posts));
};

export const emptyReplies = () => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.EMPTY_DISCUSS_POST_REPLIES,
	});
	resolve();
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

	return (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		dispatch(votePost(post.id, isPrimary, userVote, votes)).then(() => {
			Service.request('Discussion/VotePost', { id: post.id, vote: userVote });
		}).catch((error) => {
			console.log(error);
		});
	};
};

export const editPost = (id, isPrimary, message) => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.EDIT_POST,
		payload: { id, isPrimary, message },
	});
	resolve();
});

export const editPostInternal = (post, message) => {
	const isPrimary = post.parentID === null;

	return (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		dispatch(editPost(post.id, isPrimary, message)).then(() => {
			Service.request('Discussion/EditPost', { id: post.id, message });
		}).catch((error) => {
			console.log(error);
		});
	};
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
	return (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		if (!isPrimary) {
			dispatch(deletePost(post.id, isPrimary)).then(() => {
				Service.request('Discussion/DeletePost', { id: post.id });
			}).catch((error) => {
				console.log(error);
			});
		} else {
			return Service.request('Discussion/DeletePost', { id: post.id }).then(() => {
				dispatch(loadPost(null));
			}).catch((error) => {
				console.log(error);
			});
		}
	};
};

export const addQuestion = (title, message, tags) => async (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	try {
		const { post: { id } } = await Service.request('Discussion/CreatePost', { title, message, tags });
		const { post } = await Service.request('Discussion/GetPost', { id });
		post.replies = [];
		post.alias = toSeoFrendly(post.title, 100);
		dispatch(loadPost(post));
		return {
			id: post.id,
			alias: post.alias,
		};
	} catch (e) {
		console.log(e);
	}
};

export const editQuestion = (id, title, message, tags) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	const store = getState();
	const post = store.discussPost;

	return Service.request('Discussion/EditPost', {
		id, title, message, tags,
	}).then(() => {
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

export const questionFollowing = isFollowing => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.QUESTION_FOLLOWING,
		payload: isFollowing,
	});
	resolve();
});

export const questionFollowingInternal = (id, isFollowing) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	dispatch(questionFollowing(isFollowing)).then(() => {
		if (isFollowing) {
			Service.request('Discussion/FollowPost', { id });
		} else {
			Service.request('Discussion/UnfollowPost', { id });
		}
	}).catch((error) => {
		console.log(error);
	});
};

export const toggleAcceptedAnswer = (id, isAccepted) => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.ACCEPT_ANSWER,
			payload: { id, isAccepted: !isAccepted },
		});
		resolve();
	});

export const toggleAcceptedAnswerInternal = (id, isAccepted) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	dispatch(toggleAcceptedAnswer(id, isAccepted)).then(() => {
		Service.request('Discussion/ToggleAcceptedAnswer', { id, accepted: !isAccepted });
	}).catch((error) => {
		console.log(error);
	});
};

export const addReply = (postId, message) => async (dispatch, getState) => {
	const { userProfile: { name } } = getState();
	const { post } = await Service.request('Discussion/CreateReply', { postId, message });
	post.userName = name;
	// const response = await Service.request('Discussion/GetReply', { id });
	dispatch(loadReplies([ post ]));
};

export const changeDiscussQuery = (query = '') => ({ type: types.CHANGE_DISCUSS_QUERY, payload: query });
export const changeDiscussOrdering = ordering =>
	({ type: types.CHANGE_DISCUSS_ORDERING, payload: ordering });
