import { SET_SUGGESTION_CHALLENGE } from 'constants/ActionTypes';

export default (state = null, action) => {
	switch (action.type) {
	case SET_SUGGESTION_CHALLENGE:
		return action.payload;
	default:
		return state;
	}
};
