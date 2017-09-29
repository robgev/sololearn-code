import { LOG_IN, LOG_OUT } from '../constants/ActionTypes';

export default (loggedin = null, action) => {
    switch(action.type) {
        case LOG_OUT:
            return null;
        case LOG_IN:
            return action.payload;
        default:
            return loggedin;
    }
}