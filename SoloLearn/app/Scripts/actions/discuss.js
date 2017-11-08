import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { changeLoginModal } from './login.action';

// Utils
import toSeoFrendly from 'utils/linkPrettify';

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

export const getQuestionsInternal = (index, profileId = null, count = 20) =>
	(dispatch, getState) => {
		const { discussFilters: { discussQuery, discussOrdering } } = getState();
		return Service.request('Discussion/Search', {
			index, count, orderBy: discussOrdering, query: discussQuery, profileId,
		})
			.then((response) => {
				const questions = response.posts;

				if (profileId != null) {
					dispatch(getProfileQuestions(questions));
				} else {
					dispatch(getQuestions(questions));
				}

				return questions.length;
			}).catch((error) => {
				console.log(error);
			});
	};

export const loadPost = post => ({
	type: types.LOAD_DISCUSS_POST,
	payload: post,
});

export const loadPostInternal = id => dispatch => Service.request('Discussion/GetPost', { id })
	.then((response) => {
		const { post } = response;
		post.alias = toSeoFrendly(post.title, 100);
		post.replies = [];
		dispatch(loadPost(post));
	}).catch((error) => {
		console.log(error);
	});

export const loadReplies = posts => ({
	type: types.LOAD_DISCUSS_POST_REPLIES,
	payload: posts,
});

export const loadRepliesInternal = ordering => (dispatch, getState) => {
	const store = getState();
	const post = store.discussPost;

	return Service.request('Discussion/GetReplies', {
		postid: post.id, index: post.replies.length, count: 20, orderBy: ordering,
	})
		.then((response) => {
			const { posts } = response;
			dispatch(loadReplies(posts));

			return posts.length;
		}).catch((error) => {
			console.log(error);
		});
};

export const emptyReplies = () => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.EMPTY_DISCUSS_POST_REPLIES,
		payload: [],
	});
	resolve();
});

export const votePost = (id, isPrimary, vote, votes) => dispatch => new Promise((resolve) => {
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

export const addQuestion = (title, message, tags) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	return Service.request('Discussion/CreatePost', { title, message, tags }).then((response) => {
		const { post } = response;
		post.answers = 0;
		post.hasAvatar = true; // USER HASAVATAR TODO
		post.isFollowing = true;
		post.level = 5; // USER LEVEL TODO
		post.ordering = 0;
		post.replies = [];
		post.alias = toSeoFrendly(post.title, 100);
		post.userID = 24379; // USER ID TODO
		post.userName = 'Rafael Hovhannisyan'; // USER ID TODO
		post.vote = 0;
		post.xp = 24; // USER XP TODO
		post.tags = tags;

		dispatch(loadPost(post));

		return {
			id: post.id,
			alias: post.alias,
		};
	});
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

export const changeDiscussQuery = query => ({ type: types.CHANGE_DISCUSS_QUERY, payload: query });
export const changeDiscussOrdering = ordering =>
	({ type: types.CHANGE_DISCUSS_ORDERING, payload: ordering });
