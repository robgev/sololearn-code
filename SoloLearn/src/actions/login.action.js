import * as types from 'constants/ActionTypes';
import Service from 'api/service';
import Storage from 'api/storage';
import { hash, faultGenerator } from 'utils';
import { setUserProfile, getUserProfileAsync } from './profile';

export const logout = () => (dispatch) => {
	Storage.clear();
	dispatch(setUserProfile(null));
	dispatch({ type: types.CLEAR_FEED });
	return Service.request('Logout');
};

export const login = ({ email, password }) => async (dispatch, getState) => {
	const { userProfile } = getState();
	try {
		if (userProfile != null) await dispatch(logout());
		const res = await Service.request('Login', { email, password: hash(password) });
		if (res && res.error) return { err: faultGenerator(res.error.data) };
		await dispatch(getUserProfileAsync());
		return { err: false };
	} catch (e) {
		throw new Error(`Something went wrong when trying to login: ${e.message}`);
	}
};

export const signup = ({ name, email, pass }) => async (dispatch) => {
	try {
		const res = await Service.request('Register', { name, email, password: hash(pass) });
		if (res && res.error) return { err: faultGenerator(res.error.data) };
		dispatch(login({ email, pass }));
		return { err: false };
	} catch (e) {
		throw new Error(`Something went wrong when trying to signup: ${e.message}`);
	}
};

export const forgotPassword = email => () => Service.request('ForgotPassword', { email })
	.then((res) => {
		if (res && res.error) {
			return { err: faultGenerator(res.error.data) };
		}
		return { err: false };
	});
