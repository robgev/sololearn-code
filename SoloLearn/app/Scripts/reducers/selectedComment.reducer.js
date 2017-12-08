import { SET_SELECTED_COMMENT } from 'constants/ActionTypes';

export default (state = null, action) => {
	switch (action.type) {
	case SET_SELECTED_COMMENT:
		return action.payload;
	default:
		return state;
	}
};
