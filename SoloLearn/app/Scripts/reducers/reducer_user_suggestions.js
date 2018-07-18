import { GET_USER_SUGGESTIONS } from '../constants/ActionTypes';

export default (state = [], action) => {
	switch (action.type) {
	case GET_USER_SUGGESTIONS:
		return action.payload;
	default:
		return state;
	}
};
