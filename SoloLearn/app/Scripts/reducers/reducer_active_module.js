import { MODULE_SELECTED } from '../constants/ActionTypes';

export default function(state = null, action) {
    switch(action.type) {
        case MODULE_SELECTED:
            return action.payload;
        default: 
            return state;
    }
}