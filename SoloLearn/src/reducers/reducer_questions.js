import { uniqBy } from 'lodash';
import { GET_QUESTIONS, EMPTY_QUESTIONS } from '../constants/ActionTypes';

export default (state = null, action) => {
	switch (action.type) {
	case GET_QUESTIONS:
		return state === null ? action.payload : uniqBy([ ...state, ...action.payload ], 'id');
	case EMPTY_QUESTIONS:
		return null;
	default:
		return state;
	}
};
