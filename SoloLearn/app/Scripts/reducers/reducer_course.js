import { LOAD_COURSE } from '../constants/ActionTypes';


export default function(state = null, action) {
    switch(action.type) {
        case LOAD_COURSE:
            return action.payload;
        default: 
            return state;
    }
}