import { GET_QUESTIONS, EMPTY_QUESTIONS } from '../constants/ActionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case GET_QUESTIONS:
            return state.concat(action.payload);
        case EMPTY_QUESTIONS:
            return action.payload
        default: 
            return state;
    }
}