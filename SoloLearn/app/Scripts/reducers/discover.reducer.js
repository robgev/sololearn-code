import { SET_DISCOVER_SUGGESTIONS } from 'constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case SET_DISCOVER_SUGGESTIONS:
		return action.payload;
	default:
		return state;
	}
}
