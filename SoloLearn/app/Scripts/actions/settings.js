import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getSettings = () => async (dispatch) => {
	const { settings } = await Service.request('GetSettings');
	dispatch({
		type: types.SET_SETTINGS,
		payload: settings,
	});
};

export const updateSetting = newSetting => async (dispatch) => {
	await Service.request('UpdateSettings', newSetting);
	dispatch({
		type: types.UPDATE_SETTING,
		payload: newSetting,
	});
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
		payload: newProfileData,
	});
};

export const updateAvatar = imageData => async (dispatch) => {
	const response = await Service.request('UpdateAvatar', imageData);
	// I hope I will get new avatarUrl, if so,
	// dispatch({
	// 	type: types.UPDATE_PROFILE_DATA,
	// 	payload: { avatarUrl },
	// });
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
};

export const changeWeaponSetting = weaponData => async (dispatch) => {
	await Service.request('Profile/TogglePlay', weaponData);
	dispatch({
		type: types.UPDATE_WEAPON_SETTING,
		payload: weaponData,
	});
};

export const getWeaponSettings = () => (dispatch, getState) => {
	const { courses } = getState();
	const weaponSettings = courses.map(({ id, isPlayEnabled }) => ({ id, isPlayEnabled }));
	dispatch({
		type: types.SET_WEAPON_SETTINGS,
		payload: weaponSettings,
	});
};
