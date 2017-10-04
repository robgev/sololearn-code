import * as types from '../constants/ActionTypes';
import Service from '../api/service';
import Storage from '../api/storage';
import hash from '../utils/hash';
import faultGenerator from '../utils/faultGenerator';
import { loadDefaults } from './defaultActions'; 
const storage = new Storage();

export const logout = () => dispatch => {
    new Storage().clear();
    dispatch({ type: types.GET_USER_PROFILE, payload: null });
    return Service.request('Logout')
        .then(() => dispatch(logoutSync()))
        .catch(e => console.log(e));
}

export const login = ({ email, password }) => dispatch => {
    return Service.request('Login', { email, password: hash(password) })
        .then(res => {
            if(res.error) {
                return faultGenerator(res.error.data);
            } else {
                dispatch(loginSync(res.user.id));
                dispatch(loadDefaults(res.user.id));
                return false;
            }
        })
        .catch(e => console.log(e));
}

export const signup = ({ name, email, pass }) => dispatch => {
    return Service.request('Register', { name, email, password: hash(pass) })
        .then(res => {
            if(res.error) {
                return faultGenerator(res.error.data);
            } else {
                dispatch(loginSync(res.user.id));
                dispatch(loadDefaults(res.user.id));
                return false;
            }
        })
        .catch(e => console.log(e));
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

const logoutSync = () => ({ type: types.LOG_OUT });
const loginSync = payload => ({ type: types.LOG_IN, payload });