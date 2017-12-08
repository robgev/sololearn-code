import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { mandatory } from 'utils';

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

const getPathAndParams = ({
	id, index, orderby, count, type, parentId, commentsType, findPostId,
}) => {
	const common = {
		parentId, index, count, orderby, findPostId,
	};
	switch (commentsType) {
	case 'lesson':
		return [ 'Discussion/GetLessonComments', {
			...common, quizId: id, type,
		} ];
	case 'code':
		return [ 'Discussion/GetCodeComments', {
			...common, codeId: id,
		} ];
	default:
		return null;
	}
};

export const getCommentsInternal = ({
	id, index, orderby, commentsType, count = 20, type = null, parentId = null, findPostId = null,
}) => async (dispatch) => {
	const [ url, params ] = getPathAndParams({
		id, index, orderby, count, type, parentId, commentsType, findPostId,
	});
	const { comments } = await Service.request(url, params);
	if (!parentId) dispatch(getComments(comments));
	else dispatch(getReplies(parentId, comments));
};

// export const getCommentsInternal =
// 	({
// 		id, type = null, parentId = null, index, orderby, commentsType, count = 20,
// 	}) => async (dispatch, getState) => {
// 		const { comments } = getState();
// 		const sharedParams = {
// 			parentId, index, count, orderby,
// 		};
// 		const isLesson = commentsType === 'lesson';
// 		const params = isLesson ?
// 			{ ...sharedParams, quizId: id, type } :
// 			{ ...sharedParams, codeId: id };
// 		const path = isLesson ?
// 			'Discussion/GetLessonComments' :
// 			'Discussion/GetCodeComments';

// 		return Service.request(path, params).then((response) => {
// 			const responseComments = response.comments;

// 			if (!parentId) {
// 				// const forcedReplies = comments.filter((c, commentIndex) =>
// 				// 	(c.isForcedDown ? Object.assign(c, { commentIndex }) : null));

// 				// for (let i = 0; i < responseComments.length; i++) {
// 				// 	const comment = responseComments[i];
// 				// 	// comment.repliesCount = comment.replies;
// 				// 	// comment.replies = [];

// 				// 	for (let j = 0; j < forcedReplies.length; j++) {
// 				// 		if (forcedReplies[j].id === comment.id) {
// 				// 			comments.splice(forcedReplies[j].index, 1);
// 				// 		}
// 				// 	}
// 				// }

// 				dispatch(getComments(responseComments));
// 			} else {
// 				// const parentComment = comments[comments.findIndex(c => c.id === parentId)];
// 				// const forcedReplies = parentComment.replies.filter((c, parentCommentIndex) =>
// 				// 	(c.isForcedDown ? Object.assign(c, { parentCommentIndex }) : null));
// 				// for (let i = 0; i < responseComments.length; i++) {
// 				// 	const comment = responseComments[i];

// 				// 	for (let j = 0; j < forcedReplies.length; j++) {
// 				// 		if (forcedReplies[j].id === comment.id) {
// 				// 			parentComment.replies.splice(forcedReplies[j].index, 1);
// 				// 		}
// 				// 	}
// 				// }
// 				dispatch(getReplies(parentId, responseComments));
// 			}

// 			return responseComments.length;
// 		});
// 	};

export const voteComment = ({
	id, vote, votes,
}) => ({
	type: types.VOTE_COMMENT,
	payload: {
		id, vote, votes,
	},
});

export const voteCommentInternal = (comment, vote, commentsType) => (dispatch) => {
	const userVote = comment.vote === vote ? 0 : vote;
	const votes = (comment.votes + userVote) - comment.vote;

	const url = commentsType === 'lesson' ?
		'Discussion/VoteLessonComment' : 'Discussion/VoteCodeComment';

	dispatch(voteComment({ id: comment.id, vote: userVote, votes }));
	Service.request(url, { id: comment.id, vote: userVote });
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

export const setSelectedComment = (id = mandatory()) => ({
	type: types.SET_SELECTED_COMMENT,
	payload: id,
});

export const emptyComments = () => ({ type: types.EMPTY_COMMENTS });
