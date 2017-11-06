import {
	GET_COMMENTS, EMPTY_COMMENTS, VOTE_COMMENT,
	GET_COMMENT_REPLIES, EMPTY_COMMENT_REPLIES,
	EDIT_COMMENT, DELETE_COMMENT, ADD_COMMENT,
} from '../constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case GET_COMMENTS:
		return state.concat(action.payload);
	case EMPTY_COMMENTS:
		return action.payload;
	case VOTE_COMMENT:
		if (action.payload.isPrimary) {
			return Object.assign(
				[],
				state.map(comment => (comment.id === action.payload.id ?
					{ ...comment, vote: action.payload.vote, votes: action.payload.votes } : comment)),
			);
		}

		return Object.assign(
			[],
			state.map(comment => (comment.id === action.payload.parentId ?
				{
					...comment,
					replies: comment.replies.map(reply => (reply.id === action.payload.id ?
						{ ...reply, vote: action.payload.vote, votes: action.payload.votes } : reply)),
				} : comment)),
		);

	case GET_COMMENT_REPLIES:
		return Object.assign(
			[],
			state.map(comment => (comment.id === action.payload.id ?
				{ ...comment, replies: comment.replies.concat(action.payload.comments) } : comment)),
		);
	case EMPTY_COMMENT_REPLIES:
		return Object.assign(
			[],
			state.map(comment => (comment.id === action.payload ?
				{ ...comment, replies: [] } : comment)),
		);
	case EDIT_COMMENT:
		if (action.payload.isPrimary) {
			return Object.assign(
				[],
				state.map(comment => (comment.id === action.payload.id ?
					{ ...comment, message: action.payload.message } : comment)),
			);
		}

		return Object.assign(
			[],
			state.map(comment => (comment.id === action.payload.parentId ?
				{
					...comment,
					replies: comment.replies.map(reply => (reply.id === action.payload.id ?
						{ ...reply, message: action.payload.message } : reply)),
				} : comment)),
		);

	case DELETE_COMMENT:
		if (action.payload.isPrimary) {
			const index = state.findIndex(comment => comment.id == action.payload.id);

			return Object.assign(
				[],
				[
					...state.slice(0, index),
					...state.slice(index + 1),
				],
			);
		}

		// TODO CHECK
		return Object.assign(
			[],
			state.map((comment, index) =>
				(comment.id === action.payload.parentId ?
					{
						...comment,
						replies: [
							...comment.replies.slice(0, comment.replies.findIndex(reply => reply.id == action.payload.id)),
							...comment.replies.slice(comment.replies.findIndex(reply => reply.id == action.payload.id) + 1),
						],
						repliesCount: comment.repliesCount - 1,
					} : comment)),
		);

	case ADD_COMMENT:
		if (action.payload.isPrimary) {
			if (action.payload.ordering == 2 && state.length > 0) {
				const index = state.findIndex(c => c.votes === 0);
				if (index != -1) {
					return [
						...state.slice(0, index),
						action.payload.comment,
						...state.slice(index),
					];
				}

				return state.concat(action.payload.comment);
			}

			return [
				action.payload.comment,
				...state,
			];
		}

		// TODO CHECK
		return Object.assign(
			[],
			state.map((comment, index) =>
				(comment.id === action.payload.comment.parentID ?
					{
						...comment,
						replies: comment.replies.concat(action.payload.comment),
						repliesCount: comment.repliesCount + 1,
					} : comment)),
		);

	default:
		return state;
	}
}
