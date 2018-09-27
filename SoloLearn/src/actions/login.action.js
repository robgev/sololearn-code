import * as types from 'constants/ActionTypes';
import Service from 'api/service';
import Storage from 'api/storage';
import { hash, faultGenerator } from 'utils';
import { setUserProfile, getUserProfileAsync } from './profile';

export const logout = () => (dispatch) => {
	const localeBackup = Storage.load('locale');
	Storage.clear();
	Storage.save('locale', localeBackup);
	dispatch(setUserProfile(null));
	dispatch({ type: types.CLEAR_FEED });
	dispatch({ type: types.LOGOUT });
	return Service.request('Logout');
};

const prepareLogin = () => async (dispatch, getState) => {
	const { userProfile } = getState();
	if (userProfile != null) await dispatch(logout());
};

const login = data => async (dispatch) => {
	if (data && data.error) return { err: faultGenerator(data.error.data) };
	await dispatch(getUserProfileAsync());
	return { err: false };
};

export const socialLogin = ({ accessToken, service }) => async (dispatch) => {
	await dispatch(prepareLogin());
	const res = await Service.request('SocialAuthenticationWithAccessToken', { accessToken, service });
	return dispatch(login(res));
};

export const credentialsLogin = ({ email, password }) => async (dispatch) => {
	await dispatch(prepareLogin());
	const res = await Service.request('Login', { email, password: hash(password) });
	return dispatch(login(res));
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

export const forgotPassword = email => async () => {
	try {
		const res = await Service.request('ForgotPassword', { email });
		console.log(res);
		if (res && res.error) return { err: faultGenerator(res.error.data) };
		return { err: false };
	} catch (e) {
		throw new Error(`Something went wrong: ${e.message}`);
	}
};
