import Service from 'api/service';
import * as types from 'constants/ActionTypes';

const getComments = comments => ({
	type: types.GET_COMMENTS,
	payload: { comments },
});

const getReplies = (parentId, replies, fullyLoaded) => ({
	type: types.GET_COMMENT_REPLIES,
	payload: { parentId, replies, fullyLoaded },
});

const voteComment = ({
	id, vote, votes, parentId,
}) => ({
	type: types.VOTE_COMMENT,
	payload: {
		id, vote, votes, parentId,
	},
});

const addComment = ({ comment, ordering, parentId }) => ({
	type: types.ADD_COMMENT,
	payload: { comment, parentId, ordering },
});

const editComment = (id, parentId, message) => ({
	type: types.EDIT_COMMENT,
	payload: {
		id, parentId, message,
	},
});

const deleteComment = (id, parentId) => ({
	type: types.DELETE_COMMENT,
	payload: { id, parentId },
});

export const emptyComments = () => ({ type: types.EMPTY_COMMENTS });

export const emptyCommentReplies = commentId => ({
	type: types.EMPTY_COMMENT_REPLIES,
	payload: commentId,
});

export const setSelectedComment = id => ({
	type: types.SET_SELECTED_COMMENT,
	payload: id,
});

const getPathAndParams = ({
	id, index, orderby, count, type, parentId, commentsType, findPostId,
}) => {
	const common = {
		parentId, index, count, orderby, findPostId,
	};
	switch (commentsType) {
	case 'lesson':
		return [
			'Discussion/GetLessonComments',
			{ ...common, quizId: id, type },
		];
	case 'code':
		return [
			'Discussion/GetCodeComments',
			{ ...common, codeId: id },
		];
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
	if (!parentId) {
		const withReplies = comments.map(comment => ({ ...comment, repliesArray: [] }));
		dispatch(getComments(withReplies));
	} else dispatch(getReplies(parentId, comments, comments.length !== 10));
};

export const voteCommentInternal = (comment, vote, commentsType) => (dispatch) => {
	const userVote = comment.vote === vote ? 0 : vote;
	const votes = (comment.votes + userVote) - comment.vote;
	const url =
		commentsType === 'lesson'
			? 'Discussion/VoteLessonComment'
			: 'Discussion/VoteCodeComment';
	dispatch(voteComment({
		id: comment.id, vote: userVote, votes, parentId: comment.parentID,
	}));
	Service.request(url, { id: comment.id, vote: userVote });
};

export const editCommentInternal = (id, parentId, message, commentsType) =>
	(dispatch) => {
		const url =
			commentsType === 'lesson'
				? 'Discussion/EditLessonComment'
				: 'Discussion/EditCodeComment';
		dispatch(editComment(id, parentId, message));
		Service.request(url, { id, message });
	};

export const deleteCommentInternal = (id, parentId, commentsType) => (dispatch) => {
	const url =
		commentsType === 'lesson'
			? 'Discussion/DeleteLessonComment'
			: 'Discussion/DeleteCodeComment';
	dispatch(deleteComment(id, parentId));
	Service.request(url, { id });
};

const getCommentUrlAndParams = ({
	id, parentId, message, type, commentsType,
}) => {
	const common = { parentId, message };
	switch (commentsType) {
	case 'lesson':
		return [
			'Discussion/CreateLessonComment',
			{ ...common, quizId: id, type },
		];
	case 'code':
		return [
			'Discussion/CreateCodeComment',
			{ ...common, codeId: id },
		];
	default:
		return null;
	}
};

export const addCommentInternal =
	({
		id, parentId = null, message, type, commentsType, ordering,
	}) => async (dispatch, getState) => {
		const { userProfile } = getState();
		const [ url, params ] = getCommentUrlAndParams({
			id, parentId, message, type, commentsType,
		});
		const { comment } = await Service.request(url, params);
		if (parentId == null) {
			comment.repliesArray = [];
		}
		comment.userName = userProfile.name;
		comment.userId = userProfile.id;
		dispatch(addComment({ comment, parentId, ordering }));
	};
