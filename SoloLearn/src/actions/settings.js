import Service from 'api/service';
import Storage from 'api/storage';
import i18n from 'i18next';
import omit from 'lodash/omit';
import * as types from 'constants/ActionTypes';

export const resetLocaleData = locale => (dispatch) => {
	Storage.save('locale', locale);
	Service.setLocale(locale);
	Service.getSession();
	i18n.changeLanguage(locale, (err) => {
		if (err) { console.log('something went wrong loading', err); }
	});
	dispatch({
		type: types.RESET_LOCALE_DATA, payload: locale,
	});
};

export const getSettings = () => async (dispatch) => {
	const { settings } = await Service.request('GetSettings');
	dispatch({
		type: types.SET_SETTINGS,
		payload: settings,
	});
};

export const updateSetting = newSetting => async (dispatch) => {
	dispatch({
		type: types.UPDATE_SETTING,
		payload: newSetting,
	});
	await Service.request('UpdateSettings', newSetting);
};

export const getProfileData = () => (dispatch, getState) => {
	const {
		userProfile: {
			name,
			email,
			avatarUrl,
			countryCode,
		},
	} = getState();
	const profileData = {
		name,
		email,
		avatarUrl,
		countryCode,
		newPassword: '',
	};
	dispatch({
		type: types.SET_PROFILE_DATA,
		payload: profileData,
	});
};

export const updateProfile = newProfileData => async (dispatch) => {
	await Service.request('UpdateProfile', newProfileData);
	dispatch({
		type: types.UPDATE_PROFILE_DATA,
		payload: omit(newProfileData, [ 'oldPassword', 'newPassword' ]),
	});
};

export const updateAvatar = imageData => async (dispatch) => {
	const { avatarUrl } = await Service.fileRequest('UpdateAvatar', imageData);
	// I hope I will get new avatarUrl, if so,
	dispatch({
		type: types.UPDATE_PROFILE_DATA,
		payload: { avatarUrl },
	});
};

export const blockUser = blockData => async (dispatch) => {
	dispatch({
		type: types.UPDATE_BLOCKED_USERS,
		payload: blockData,
	});
	await Service.request('Profile/BlockUser', blockData);
};

export const getBlockedUsers = pagingData => async (dispatch) => {
	const { users } = await Service.request('Profile/GetBlockedUsers', pagingData);
	const payload = users.map(user => ({ ...user, blockedState: true }));
	dispatch({
		type: types.SET_BLOCKED_USERS,
		payload,
	});
	return users.length;
};

export const changeWeaponSetting = weaponData => async (dispatch) => {
	dispatch({
		type: types.UPDATE_WEAPON_SETTING,
		payload: weaponData,
	});
	await Service.request('Profile/TogglePlay', weaponData);
};

export const getWeaponSettings = () => (dispatch, getState) => {
	const { courses, userProfile } = getState();
	const weaponSettings = courses.map(({
		id,
		iconUrl,
		languageName,
		isPlayEnabled,
	}) => ({
		id,
		iconUrl,
		languageName,
		isPlayEnabled,
		enabled: Boolean(userProfile.challengeSkills.find(c => c.id === id)),
	}));
	dispatch({
		type: types.SET_WEAPON_SETTINGS,
		payload: weaponSettings,
	});
};
