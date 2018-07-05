import { combineReducers } from 'redux';
import { CHANGE_DISCUSS_QUERY, CHANGE_DISCUSS_ORDERING, CHANGE_DISCUSS_HAS_MORE } from '../constants/ActionTypes';

const tag = (state = '', action) => {
	switch (action.type) {
	case CHANGE_DISCUSS_QUERY:
		return action.payload;
	default:
		return state;
	}
};

const order = (state = 8, action) => {
	switch (action.type) {
	case CHANGE_DISCUSS_ORDERING:
		return action.payload;
	default:
		return state;
	}
};

const hasMore = (state = true, action) => {
	switch (action.type) {
	case CHANGE_DISCUSS_HAS_MORE:
		return action.payload;
	default:
		return state;
	}
};

export default combineReducers({ tag, order, hasMore });
