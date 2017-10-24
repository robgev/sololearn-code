import { changeLoginModal } from '../actions/login.action';
import { protectedActions } from '../constants/ActionTypes';

const isProtected = (action) => {
    if(typeof action === 'function') {
        return false;
    } else {
        return protectedActions.includes(action.type);
    }
}

const modalMiddleware = ({ dispatch, getState }) => next => action => {
    const { imitLoggedin } = getState();
    if(!imitLoggedin && isProtected(action)) {
        return Promise.resolve(dispatch(changeLoginModal(true)));
    } else {
        return next(action);
    }
}

export default modalMiddleware;