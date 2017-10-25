import * as types from '../constants/ActionTypes';
import Service from '../api/service';
import Storage from '../api/storage';
import hash from '../utils/hash';
import faultGenerator from '../utils/faultGenerator';
import { loadDefaults, getUserProfile } from './defaultActions'; 

export const logout = () => dispatch => {
    new Storage().clear();
    dispatch(getUserProfile(null))
    dispatch({ type: types.CLEAR_FEED });
    return Service.request('Logout')
        .catch(e => console.log(e));
}

export const login = ({ email, password }) => async (dispatch, getState) => {
    const { userProfile, imitLoggedin } = getState();
    try {
        if(userProfile != null) await dispatch(logout());
        const res = await Service.request('Login', { email, password: hash(password) });
        if(res.error) return faultGenerator(res.error.data);
        const { profile } = await Service.request('Profile/GetProfile', { id: res.user.id });
        new Storage().save('profile', profile);
        dispatch(getUserProfile(profile));
        if(!imitLoggedin) {
            dispatch(imitateLogin());
            dispatch(changeLoginModal(false));
        }
    } catch(e) {
        console.log(e);
    }
}

export const signup = ({ name, email, pass }) => async dispatch => {
    try {
        const res = await Service.request('Register', { name, email, password: hash(pass) });
        if(res.error) return faultGenerator(res.error.data);
        dispatch(login({ email, password }));
    } catch(e) {
        console.log(e);
    }
}

export const forgotPassword = email => dispatch => {
    return Service.request('ForgotPassword', { email })
        .then(res => {
            if(res.error) {
                return faultGenerator(res.error.data);
            } else {
                return false;
            }
        })
}

export const imitateLogin = () => ({ type: types.IMITATE_LOGIN });

export const changeLoginModal = (isOpen) => {
    return { type: types.CHANGE_LOGIN_MODAL, payload: isOpen }
};