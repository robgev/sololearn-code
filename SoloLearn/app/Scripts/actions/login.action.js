import * as types from 'constants/ActionTypes';
import Service from 'api/service';
import Storage from 'api/storage';
import { hash, faultGenerator } from 'utils';
import { getUserProfile } from './defaultActions';

export const imitateLogin = () => ({ type: types.IMITATE_LOGIN });

export const changeLoginModal = isOpen => ({ type: types.CHANGE_LOGIN_MODAL, payload: isOpen });

export const logout = () => (dispatch) => {
	const currentStorage = new Storage();
	const deviceID = currentStorage.load('DeviceUniqueID');
	currentStorage.clear();
	currentStorage.save('DeviceUniqueID', deviceID);
	dispatch(getUserProfile(null));
	dispatch({ type: types.CLEAR_FEED });
	return Service.request('Logout')
		.catch(e => console.log(e));
};

export const login = ({ email, password }) => async (dispatch, getState) => {
	const { userProfile, imitLoggedin } = getState();
	try {
		if (userProfile != null) await dispatch(logout());
		Service.isFirstRequest = true;
		const res = await Service.request('Login', { email, password: hash(password) });
		if (res.error) return { err: faultGenerator(res.error.data) };
		const { profile } = await Service.request('Profile/GetProfile', { id: res.user.id });
		new Storage().save('profile', profile);
		dispatch(getUserProfile(profile));
		if (!imitLoggedin) {
			dispatch(imitateLogin());
			dispatch(changeLoginModal(false));
		}
		return { err: false };
	} catch (e) {
		console.log(e);
	}
};

export const signup = ({ name, email, pass }) => async (dispatch) => {
	try {
		const res = await Service.request('Register', { name, email, password: hash(pass) });
		if (res.error) return { err: faultGenerator(res.error.data) };
		dispatch(login({ email, pass }));
		return { err: false };
	} catch (e) {
		console.log(e);
	}
};

export const forgotPassword = email => () => Service.request('ForgotPassword', { email })
	.then((res) => {
		if (res.error) {
			return { err: faultGenerator(res.error.data) };
		}
		return { err: false };
	});
