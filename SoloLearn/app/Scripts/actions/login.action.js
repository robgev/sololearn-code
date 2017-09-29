import * as types from '../constants/ActionTypes';
import Service from '../api/service';
import Storage from '../api/storage';
import hmacsha1 from 'hmacsha1';
const storage = new Storage();

export const logout = () => dispatch => {
    storage.clear()
    return Service.request('Logout')
        .then(() => dispatch(logoutSync()))
        .catch(e => console.log(e));
}

export const login = (email, unhashed) => dispatch => {
    const password = hmacsha1('password', unhashed).slice(0, -1);
    return Service.request('Login', { email, password })
        .then(res => {
            dispatch(loginSync(res.user.id))
        })
        .catch(e => console.log(e));
}

const logoutSync = () => ({ type: types.LOG_OUT });
const loginSync = payload => ({ type: types.LOG_IN, payload });