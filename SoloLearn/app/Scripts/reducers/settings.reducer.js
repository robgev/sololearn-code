import {
	SET_SETTINGS,
	UPDATE_SETTING,
	SET_PROFILE_DATA,
	UPDATE_PROFILE_DATA,
	SET_BLOCKED_USERS,
	UPDATE_BLOCKED_USERS,
	SET_WEAPON_SETTINGS,
	UPDATE_WEAPON_SETTING,
} from 'constants/ActionTypes';
import { combineReducers } from 'redux';

const toggleUserBlock = (blockedUsers, { userId, block: blockedState }) => {
	const targetUserIndex = blockedUsers.findIndex(currentUser => currentUser.id === userId);
	const targetUserData = blockedUsers[targetUserIndex];
	return [
		...blockedUsers.slice(0, targetUserIndex),
		{ ...targetUserData, blockedState },
		...blockedUsers.slice(targetUserIndex + 1),
	];
};

const blockedUsers = (state = [], action) => {
	switch (action.type) {
	case SET_BLOCKED_USERS:
		return action.payload;
	case UPDATE_BLOCKED_USERS:
		return toggleUserBlock(state, action.payload);
	default:
		return state;
	}
};

const feedSettings = (state = null, action) => {
	switch (action.type) {
	case SET_SETTINGS:
		return action.payload;
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

const playSettings = (state = null, action) => {
	switch (action.type) {
	case SET_WEAPON_SETTINGS:
		return action.payload;
	case UPDATE_WEAPON_SETTING:
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
