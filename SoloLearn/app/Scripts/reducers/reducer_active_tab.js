import { TAB_SELECTED } from '../constants/ActionTypes';

export default function(state = null, action) {
    // console.log(action)
    switch(action.type) {
        case TAB_SELECTED:
            return action.payload;
        default:
            return state;
    }
}