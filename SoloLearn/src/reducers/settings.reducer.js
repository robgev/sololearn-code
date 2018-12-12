import {
	SET_SETTINGS,
	UPDATE_SETTING,
	SET_PROFILE_DATA,
	UPDATE_PROFILE_DATA,
	SET_BLOCKED_USERS,
	UPDATE_BLOCKED_USERS,
	SET_WEAPON_SETTINGS,
	UPDATE_WEAPON_SETTING,
	REMOVE_UNBLOCKED_USERS_FROM_LIST,
} from 'constants/ActionTypes';
import uniqBy from 'lodash/uniqBy';
import { combineReducers } from 'redux';

const toggleUserBlock = (blockedUsers, { userId, block: blockedState }) =>
	blockedUsers.map(user => (user.id === userId ? { ...user, blockedState } : user));

const toggleLanguageSetting = (playSettings, { courseId, enable: isPlayEnabled }) => {
	const targetLanguageSettingIndex =
		playSettings.findIndex(currentSetting => currentSetting.id === courseId);
	const targetLanguageSetting = playSettings[targetLanguageSettingIndex];
	return [
		...playSettings.slice(0, targetLanguageSettingIndex),
		{ ...targetLanguageSetting, isPlayEnabled },
		...playSettings.slice(targetLanguageSettingIndex + 1),
	];
};

const filterSettings = allSettings =>
	Object.keys(allSettings).reduce((accumulator, settingName) => (
		settingName.includes('feed') ? { ...accumulator, [settingName]: allSettings[settingName] } : accumulator
	), {});

const blockedUsers = (state = [], action) => {
	switch (action.type) {
	case SET_BLOCKED_USERS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case UPDATE_BLOCKED_USERS:
		return toggleUserBlock(state, action.payload);
	case REMOVE_UNBLOCKED_USERS_FROM_LIST:
		return state.filter(profile => profile.blockedState);
	default:
		return state;
	}
};

const playSettings = (state = [], action) => {
	switch (action.type) {
	case SET_WEAPON_SETTINGS:
		return action.payload;
	case UPDATE_WEAPON_SETTING:
		return toggleLanguageSetting(state, action.payload);
	default:
		return state;
	}
};

const feedSettings = (state = null, action) => {
	switch (action.type) {
	case SET_SETTINGS:
		return filterSettings(action.payload);
	case UPDATE_SETTING:
		return { ...state, ...action.payload };
	default:
		return state;
	}
};

const profileData = (state = null, action) => {
	switch (action.type) {
	case SET_PROFILE_DATA:
		return action.payload;
	case UPDATE_PROFILE_DATA:
		return { ...state, ...action.payload };
	default:
		return state;
	}
};

// Decide on avatar stuff
export default combineReducers({
	profileData,
	blockedUsers,
	playSettings,
	feedSettings,
});
