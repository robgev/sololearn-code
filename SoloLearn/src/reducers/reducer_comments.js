import { combineReducers } from 'redux';
import {
	GET_COMMENTS, EMPTY_COMMENTS, VOTE_COMMENT,
	GET_COMMENT_REPLIES, EMPTY_COMMENT_REPLIES, EDIT_COMMENT,
	DELETE_COMMENT, ADD_COMMENT, SET_SELECTED_COMMENT, ADD_COMMENTS_ABOVE,
	ADD_REPLIES_ABOVE, SET_COMMENTS_COUNT,
} from 'constants/ActionTypes';
import {
	getComments, addComment, voteComment,
	deleteComment, editComment, getCommentReplies,
	getCommentsAbove, getRepliesAbove,
} from 'utils/comments.utils';

const _getComments = (comments, newComments) => {
	if (newComments.length > 0 && newComments[0].index === -1) {
		return getRepliesAbove(newComments[0], { aboveComments: newComments.slice(1) });
	}
	return getComments(comments, newComments);
};

const selected = (state = null, action) => {
	switch (action.type) {
	case SET_SELECTED_COMMENT:
		return action.payload;
	default:
		return state;
	}
};

const data = (state = [], action) => {
	switch (action.type) {
	case GET_COMMENTS:
		return _getComments(state, action.payload.comments);
	case ADD_COMMENTS_ABOVE:
		return getCommentsAbove(state, action.payload);
	case ADD_REPLIES_ABOVE:
		return getRepliesAbove(state[0], action.payload);
	case EMPTY_COMMENTS:
		return [];
	case VOTE_COMMENT:
		return voteComment(state, action.payload);
	case GET_COMMENT_REPLIES:
		return getCommentReplies(state, action.payload);
	case EMPTY_COMMENT_REPLIES:
		return state.map(comment =>
			(comment.id === action.payload
				? { ...comment, repliesArray: [] }
				: comment));
	case EDIT_COMMENT:
		return editComment(state, action.payload);
	case DELETE_COMMENT:
		return deleteComment(state, action.payload);
	case ADD_COMMENT:
		return addComment(state, action.payload);
	default:
		return state;
	}
};

const count = (state = 0, action) => {
	switch (action.type) {
	case SET_COMMENTS_COUNT:
		return action.payload;
	default:
		return state;
	}
};

export default combineReducers({
	data,
	count,
	selected,
});
