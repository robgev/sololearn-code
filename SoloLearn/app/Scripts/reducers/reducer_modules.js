import { MAP_MODULES } from '../constants/ActionTypes';


export default function(state = null, action) {
    switch(action.type) {
        case MAP_MODULES:
            return action.payload;
        default: 
            return state;
    }
}