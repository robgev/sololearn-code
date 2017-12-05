import {
	SET_LESSON_COLLECTIONS,
} from 'constants/ActionTypes';

export default (state = [], action) => {
	switch (action.type) {
	case SET_LESSON_COLLECTIONS:
		return [ ...state, ...action.payload ];
	default:
		return state;
	}
};
