import uniqBy from 'lodash/uniqBy';
import { SET_LIKES_LIST, EMPTY_LIKES_LIST } from 'constants/ActionTypes';

export default (state = [], action) => {
	switch (action.type) {
	case SET_LIKES_LIST:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case EMPTY_LIKES_LIST:
		return [];
	default:
		return state;
	}
};
