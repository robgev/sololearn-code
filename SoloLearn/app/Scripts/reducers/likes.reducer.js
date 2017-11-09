import { SET_LIKES_LIST } from '../constants/ActionTypes';
import removeDups from '../utils/removeDups';

const nextState = (oldLikes, newLikes) => {
	if (newLikes == null) {
		return null;
	}
	return oldLikes == null ? newLikes : removeDups([ ...oldLikes, ...newLikes ]);
};

export default (state = null, action) => {
	switch (action.type) {
	case SET_LIKES_LIST:
		return nextState(state, action.payload);
	default:
		return state;
	}
};
