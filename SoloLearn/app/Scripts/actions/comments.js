import Service from '../api/service';
import * as types from '../constants/ActionTypes';

export const getComments = comments => ({
	type: types.GET_COMMENTS,
	payload: comments,
});

export const getReplies = (commentId, comments) => ({
	type: types.GET_COMMENT_REPLIES,
	payload: {
		id: commentId,
		comments,
	},
});

export const getCommentsInternal =
(id, type, parentId, index, oredring, commentsType, count = 20) => {
	let path = '';
	const params = {
		parentId,
		index,
		count,
		orderby: oredring,
	};

	if (commentsType === 'lesson') {
		path = 'Discussion/GetLessonComments';
		params.quizId = id;
		params.type = type;
	} else if (commentsType === 'code') {
		path = 'Discussion/GetCodeComments';
		params.codeId = id;
	}

	return (dispatch, getState) => {
		const store = getState();
		const loadedComments = store.comments;

		return Service.request(path, params).then((response) => {
			const responseComments = response.comments;

			if (parentId === null) {
				const forcedReplies = loadedComments.filter((c, commentIndex) =>
					(c.isForcedDown ? Object.assign(c, { commentIndex }) : null));

				for (let i = 0; i < responseComments.length; i++) {
					const comment = responseComments[i];
					comment.repliesCount = comment.replies;
					comment.replies = [];

					for (let j = 0; j < forcedReplies.length; j++) {
						if (forcedReplies[j].id === comment.id) {
							loadedComments.splice(forcedReplies[j].index, 1);
						}
					}
				}

				dispatch(getComments(responseComments));
			} else {
				const parentComment = loadedComments[loadedComments.findIndex(c => c.id === parentId)];
				const forcedReplies = parentComment.replies.filter((c, parentCommentIndex) =>
					(c.isForcedDown ? Object.assign(c, { parentCommentIndex }) : null));

				for (let i = 0; i < responseComments.length; i++) {
					const comment = responseComments[i];

					for (let j = 0; j < forcedReplies.length; j++) {
						if (forcedReplies[j].id === comment.id) {
							parentComment.replies.splice(forcedReplies[j].index, 1);
						}
					}
				}

				dispatch(getReplies(parentId, responseComments));
			}

			return responseComments.length;
		}).catch((error) => {
			console.log(error);
		});
	};
};

export const emptyComments = () => dispatch => new Promise((resolve) => {
	dispatch({
		type: types.EMPTY_COMMENTS,
		payload: [],
	});
	resolve();
});

export const voteComment = (id, parentId, isPrimary, vote, votes) =>
	dispatch => new Promise((resolve) => {
		dispatch({
			type: types.VOTE_COMMENT,
			payload: {
				id, parentId, isPrimary, vote, votes,
			},
		});
		resolve();
	});

export const voteCommentInternal = (comment, vote, commentsType) => {
	let path = '';
	const userVote = comment.vote === vote ? 0 : vote;
	const votes = (comment.votes + userVote) - comment.vote;
	const isPrimary = comment.parentID === null;

	if (commentsType === 'lesson') {
		path = 'Discussion/VoteLessonComment';
	} else if (commentsType === 'code') {
		path = 'Discussion/VoteCodeComment';
	}

	return (dispatch) => {
		dispatch(voteComment(comment.id, comment.parentID, isPrimary, userVote, votes)).then(() => {
			Service.request(path, { id: comment.id, vote: userVote });
		}).catch((error) => {
			console.log(error);
		});
	};
};

export const emptyCommentReplies = commentId => ({
	type: types.EMPTY_COMMENT_REPLIES,
	payload: commentId,
});

export const editComment = (id, parentId, isPrimary, message) =>
	dispatch => new Promise((resolve) => {
		dispatch({
			type: types.EDIT_COMMENT,
			payload: {
				id, parentId, isPrimary, message,
			},
		});
		resolve();
	});

export const editCommentInternal = (id, parentId, message, commentsType) => {
	const isPrimary = parentId === null;
	let path = '';

	if (commentsType === 'lesson') {
		path = 'Discussion/EditLessonComment';
	} else if (commentsType === 'code') {
		path = 'Discussion/EditCodeComment';
	}

	return dispatch => dispatch(editComment(id, parentId, isPrimary, message)).then(() => {
		Service.request(path, { id, message });
	}).catch((error) => {
		console.log(error);
	});
};

export const deleteComment = (id, parentId, isPrimary) =>
	dispatch => new Promise((resolve) => {
		dispatch({
			type: types.DELETE_COMMENT,
			payload: { id, parentId, isPrimary },
		});
		resolve();
	});

export const deleteCommentInternal = (id, parentId, commentsType) => {
	const isPrimary = parentId === null;
	let path = '';

	if (commentsType === 'lesson') {
		path = 'Discussion/DeleteLessonComment';
	} else if (commentsType === 'code') {
		path = 'Discussion/DeleteCodeComment';
	}

	return dispatch => dispatch(deleteComment(id, parentId, isPrimary)).then(() => {
		Service.request(path, { id });
	}).catch((error) => {
		console.log(error);
	});
};

export const addComment = (comment, isPrimary, ordering) => ({
	type: types.ADD_COMMENT,
	payload: { comment, isPrimary, ordering },
});

export const addCommentInternal = (id, parentId, message, type, commentsType, ordering) => {
	const isPrimary = parentId === null;
	let path = '';
	const params = {
		parentId,
		message,
	};

	if (commentsType === 'lesson') {
		path = 'Discussion/CreateLessonComment';
		params.quizId = id;
		params.type = type;
	} else if (commentsType === 'code') {
		path = 'Discussion/CodeLessonComment';
	}

	return dispatch => Service.request(path, params).then((response) => {
		const { comment } = response;
		comment.repliesCount = 0;
		comment.replies = [];
		comment.userName = 'Rafael Hovhannisyan'; // TODO Change after User class implemantation
		comment.isForcedDown = true;

		if (isPrimary) {
			dispatch(addComment(comment, isPrimary, ordering));
		} else {
			dispatch(addComment(comment, isPrimary, ordering));
		}
	});
};
