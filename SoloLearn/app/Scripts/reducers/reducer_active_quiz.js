import { QUIZ_SELECTED } from '../constants/ActionTypes';

export default function(state = null, action) {
    switch(action.type) {
        case QUIZ_SELECTED:
            return action.payload;
        default: 
            return state;
    }
}