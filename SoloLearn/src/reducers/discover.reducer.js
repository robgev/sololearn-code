import { SET_DISCOVER_SUGGESTIONS, FOLLOW_USER_SUGGESTION } from 'constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case SET_DISCOVER_SUGGESTIONS:
		return action.payload;
	case FOLLOW_USER_SUGGESTION:
		return state.map(suggestion =>
			(suggestion.id !== action.payload.userId
				? suggestion
				: { ...suggestion, isFollowing: action.payload.isFollowing }
			));
	default:
		return state;
	}
}
