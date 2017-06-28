import { GET_CODES, EMPTY_CODES} from '../constants/ActionTypes';

export default function(state = [], action) {
    switch(action.type) {
        case GET_CODES:
            return state.concat(action.payload);
        case EMPTY_CODES:
            return action.payload
        default: 
            return state;
    }
}