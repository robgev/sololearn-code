import { CHANGE_LOGIN_MODAL } from '../constants/ActionTypes';

export default (state = false, action) => {
	switch (action.type) {
	case CHANGE_LOGIN_MODAL:
		return action.payload;
	default:
		return state;
	}
};
