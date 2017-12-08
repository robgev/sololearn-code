import { findIndex } from 'lodash';
import { repliesOfId } from 'utils';
import {
	GET_COMMENTS, EMPTY_COMMENTS, VOTE_COMMENT,
	GET_COMMENT_REPLIES, EMPTY_COMMENT_REPLIES,
	EDIT_COMMENT, DELETE_COMMENT, ADD_COMMENT,
} from 'constants/ActionTypes';

const addReplies = (comments, { replies, id }) => {
	const firstReplyIndex = findIndex(comments, el => el.id === id) + 1;
	const repliesCount = findIndex(comments.slice(firstReplyIndex), el => el.parentID == null);
	const count = firstReplyIndex + repliesCount;
	return [ ...comments.slice(0, count), ...replies, ...comments.slice(count) ];
};

const emptyReplies = (comments, id) => {
	const { length } = repliesOfId(comments, id);
	const firstReplyIndex = findIndex(comments, el => el.id === id) + 1;
	return [ ...comments.slice(0, firstReplyIndex), ...comments.slice(firstReplyIndex + length) ];
};

const deleteComment = (comments, id) => {
	const index = findIndex(comments, comment => comment.id === id);
	return [ ...comments.slice(0, index), ...comments.slice(index + 1) ];
};

const addComment = (comments, { ordering, comment }) => {
	if (ordering === 2 && comments.length > 0) {
		const index = comments.findIndex(c => c.votes === 0);
		if (index !== -1) {
			return [
				...comments.slice(0, index),
				comment,
				...comments.slice(index),
			];
		}
		return [ ...comments, comment ];
	}
	return [
		comment,
		...comments,
	];
};

export default (state = [], action) => {
	switch (action.type) {
	case GET_COMMENTS:
		return [ ...state, ...action.payload ];
	case EMPTY_COMMENTS:
		return [];
	case VOTE_COMMENT:
		return state.map(comment => (comment.id === action.payload.id ?
			{ ...comment, vote: action.payload.vote, votes: action.payload.votes } : comment));
	case GET_COMMENT_REPLIES:
		return addReplies(state, { replies: action.payload.comments, id: action.payload.id });
	case EMPTY_COMMENT_REPLIES:
		return emptyReplies(state, action.payload);
	case EDIT_COMMENT:
		return state.map(comment => (comment.id === action.payload.id ?
			{ ...comment, message: action.payload.message } : comment
		));
	case DELETE_COMMENT:
		return deleteComment(state, action.payload.id);
	case ADD_COMMENT:
		return addComment(state, action.payload);
	default:
		return state;
	}
};
