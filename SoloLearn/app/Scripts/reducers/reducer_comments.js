import { combineReducers } from 'redux';
import {
	GET_COMMENTS, EMPTY_COMMENTS, VOTE_COMMENT,
	GET_COMMENT_REPLIES, EMPTY_COMMENT_REPLIES, EDIT_COMMENT,
	DELETE_COMMENT, ADD_COMMENT, SET_SELECTED_COMMENT,
} from 'constants/ActionTypes';
import { getComments, addComment, voteComment, deleteComment, editComment, getCommentReplies } from 'utils/comments.utils';

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
		return getComments(state, action.payload.comments);
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

export default combineReducers({
	data,
	selected,
});
