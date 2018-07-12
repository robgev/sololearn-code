import * as types from 'constants/ActionTypes';
import Service from 'api/service';
import Storage from 'api/storage';
import { hash, faultGenerator } from 'utils';
import { setUserProfile } from './profile';

export const logout = () => (dispatch) => {
	const deviceID = Storage.load('DeviceUniqueID');
	Storage.clear();
	Storage.save('DeviceUniqueID', deviceID);
	dispatch(setUserProfile(null));
	dispatch({ type: types.CLEAR_FEED });
	return Service.request('Logout')
		.catch(e => console.log(e));
};

export const login = ({ email, password }) => async (dispatch, getState) => {
	const { userProfile } = getState();
	try {
		if (userProfile != null) await dispatch(logout());
		Service.isFirstRequest = true;
		const res = await Service.request('Login', { email, password: hash(password) });
		if (res.error) return { err: faultGenerator(res.error.data) };
		const { profile } = await Service.request('Profile/GetProfile');
		Storage.save('profile', profile);
		dispatch(setUserProfile(profile));
		return { err: false };
	} catch (e) {
		throw new Error(`Something went wrong when trying to login M: ${e.message}`);
	}
};

export const signup = ({ name, email, pass }) => async (dispatch) => {
	try {
		const res = await Service.request('Register', { name, email, password: hash(pass) });
		if (res.error) return { err: faultGenerator(res.error.data) };
		dispatch(login({ email, pass }));
		return { err: false };
	} catch (e) {
		throw new Error(`Something went wrong when trying to signup M: ${e.message}`);
	}
};

export const forgotPassword = email => () => Service.request('ForgotPassword', { email })
	.then((res) => {
		if (res.error) {
			return { err: faultGenerator(res.error.data) };
		}
		return { err: false };
	});
