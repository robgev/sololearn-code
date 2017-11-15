import {
	LOAD_DISCUSS_POST,
	LOAD_DISCUSS_POST_REPLIES,
	EMPTY_DISCUSS_POST_REPLIES,
	VOTE_POST, EDIT_POST,
	DELETE_POST,
	QUESTION_FOLLOWING,
	ACCEPT_ANSWER,
} from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case LOAD_DISCUSS_POST:
		return action.payload;
	case LOAD_DISCUSS_POST_REPLIES:
		return Object.assign({}, state, {
			replies: state.replies.concat(action.payload),
		});
	case EMPTY_DISCUSS_POST_REPLIES:
		return Object.assign({}, state, {
			replies: action.payload,
		});
	case VOTE_POST:
		if (action.payload.isPrimary) {
			return Object.assign({}, state, {
				vote: action.payload.vote,
				votes: action.payload.votes,
			});
		}

		return Object.assign({}, state, {
			replies: state.replies.map(reply => (reply.id === action.payload.id ?
				{ ...reply, vote: action.payload.vote, votes: action.payload.votes } : reply)),
		});

	case EDIT_POST:
		if (action.payload.isPrimary) {
			return Object.assign({}, state, {
				message: action.payload.message,
			});
		}

		return Object.assign({}, state, {
			replies: state.replies.map(reply => (reply.id === action.payload.id ?
				{ ...reply, message: action.payload.message } : reply)),
		});

	case DELETE_POST:
		const index = state.replies.findIndex(reply => reply.id == action.payload.id);
		console.log(index);
		return Object.assign({}, state, {
			replies: [
				...state.replies.slice(0, index),
				...state.replies.slice(index + 1),
			],
		});
	case QUESTION_FOLLOWING:
		return Object.assign({}, state, {
			isFollowing: action.payload,
		});
	case ACCEPT_ANSWER:
		return Object.assign({}, state, {
			replies: state.replies.map(reply => (reply.id === action.payload.id ?
				{ ...reply, isAccepted: action.payload.isAccepted } :
				{ ...reply, isAccepted: false })),
		});
	default:
		return state;
	}
}
