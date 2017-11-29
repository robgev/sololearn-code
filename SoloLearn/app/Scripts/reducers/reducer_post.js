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

const votePost = (state, {
	vote, votes, isPrimary, id,
}) => {
	if (isPrimary) {
		return { ...state, vote, votes };
	}
	const replies = state.replies.map(reply => (reply.id === id ?
		{ ...reply, vote, votes } : reply));
	return {
		...state,
		replies,
	};
};

const editPost = (state, { message, isPrimary, id }) => {
	if (isPrimary) {
		return { ...state, message };
	}
	return {
		...state,
		replies: state.replies.map(reply => (reply.id === id ?
			{ ...reply, message } : reply)),
	};
};

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
		return votePost(state, action.payload);
	case EDIT_POST:
		return editPost(state, action.payload);
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
