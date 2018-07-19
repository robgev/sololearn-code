import { SET_NOTIFICATION_COUNT } from '../constants/ActionTypes';

export default (state = 0, action) => {
	switch (action.type) {
	case SET_NOTIFICATION_COUNT:
		return action.payload;
	default:
		return state;
	}
};
