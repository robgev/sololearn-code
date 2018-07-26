import { uniqBy } from 'lodash';
import { GET_QUESTIONS, EMPTY_QUESTIONS } from 'constants/ActionTypes';

export default (state = [], action) => {
	switch (action.type) {
	case GET_QUESTIONS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case EMPTY_QUESTIONS:
		return [];
	default:
		return state;
	}
};
