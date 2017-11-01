import { combineReducers } from 'redux';
import { CHANGE_DISCUSS_QUERY, CHANGE_DISCUSS_ORDERING } from '../constants/ActionTypes';

const discussQuery = (state = '', action) => {
    switch(action.type) {
        case CHANGE_DISCUSS_QUERY:
        return action.payload;
        default:
        return state;
    }
}

const discussOrdering = (state = 8, action) => {
    switch(action.type) {
        case CHANGE_DISCUSS_ORDERING:
        return action.payload;
        default:
        return state;
    }
}

export default combineReducers({ discussQuery, discussOrdering });