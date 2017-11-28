import {
	LOAD_DISCUSS_POST,
	LOAD_DISCUSS_POST_REPLIES,
	LOAD_DISCUSS_POST_PREVIOUS_REPLIES,
	EMPTY_DISCUSS_POST_REPLIES,
	VOTE_POST, EDIT_POST,
	DELETE_POST,
	QUESTION_FOLLOWING,
	ACCEPT_ANSWER,
} from '../constants/ActionTypes';

export default (state = null, action) => {
	if (state == null && action.type !== LOAD_DISCUSS_POST) return null;
	switch (action.type) {
	case LOAD_DISCUSS_POST:
		return action.payload;
	case LOAD_DISCUSS_POST_REPLIES:
		return { ...state, replies: [ ...state.replies, ...action.payload ] };
	case LOAD_DISCUSS_POST_PREVIOUS_REPLIES:
		return { ...state, replies: [ ...action.payload, ...state.replies ] };
	case EMPTY_DISCUSS_POST_REPLIES:
		return { ...state, replies: [] };
	case VOTE_POST:
		const { vote, votes } = action.payload;
		if (action.payload.isPrimary) {
			return { ...state, vote, votes };
		}
		const replies = state.replies.map(reply => (reply.id === action.payload.id ?
			{ ...reply, vote, votes } : reply));
		console.warn(replies);
		return {
			...state,
			replies,
		};
	case EDIT_POST:
		const { message } = action.payload;
		if (action.payload.isPrimary) {
			return { ...state, message };
		}
		return {
			...state,
			replies: state.replies.map(reply => (reply.id === action.payload.id ?
				{ ...reply, message } : reply)),
		};
	case DELETE_POST:
		return { ...state, replies: state.replies.filter(reply => reply.id !== action.payload.id) };
	case QUESTION_FOLLOWING:
		return { ...state, isFollowing: action.payload };
	case ACCEPT_ANSWER:
		return {
			...state,
			replies: state.replies.map(reply => (reply.id === action.payload.id ?
				{ ...reply, isAccepted: action.payload.isAccepted } :
				{ ...reply, isAccepted: false })),
		};
	default:
		return state;
	}
};
