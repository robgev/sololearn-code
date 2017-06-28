import { LOAD_LEVELS } from '../constants/ActionTypes';

export default function(state = null, action) {
    switch(action.type) {
        case LOAD_LEVELS:
            return action.payload;
        default: 
            return state;
    }
}