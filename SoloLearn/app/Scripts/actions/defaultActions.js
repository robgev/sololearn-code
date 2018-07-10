import { browserHistory } from 'react-router';

import Service from 'api/service';
import Storage from 'api/storage';
import * as types from 'constants/ActionTypes';

const loadLevels = payload => ({ type: types.LOAD_LEVELS, payload });

export const getUserProfile = payload => ({ type: types.GET_USER_PROFILE, payload });

const getProfile = payload => ({ type: types.GET_PROFILE, payload });

export const clearOpenedProfile = () => getProfile(null);

const loadCourses = payload => ({ type: types.LOAD_COURSES, payload });

export const getProfileInternal = userId => async (dispatch) => {
	if (!userId) {
		const profile = Storage.load('profile');
		if (profile != null) {
			dispatch(getUserProfile(profile));
			Service.request('Profile/GetProfile', { userId })
				.then(({ profile: updated }) => {
					Storage.save('profile', updated);
					dispatch(getUserProfile(updated));
				});
		} else {
			browserHistory.replace('/login');
		}
	} else {
		const { profile } = await Service.request('Profile/GetProfile', { id: userId });
		const payload = { ...profile, blockedState: false };
		dispatch(getProfile(payload));
	}
};

export const loadCoursesInternal = () => {
	const courses = Storage.load('courses');
	const levels = Storage.load('levels');

	if (courses != null || levels != null) {
		return dispatch => new Promise((resolve) => {
			dispatch(loadCourses(courses));
			dispatch(loadLevels(levels));
			resolve();
		});
	}

	return dispatch => Service.request('GetCourses', null).then((response) => {
		Storage.save('courses', response.courses); // Saveing data to Storage
		Storage.save('levels', response.levels); // Saveing data to localStorage

		dispatch(loadCourses(response.courses));
		dispatch(loadLevels(response.levels));
	}).catch((error) => {
		console.log(error);
	});
};

export const loadDefaults = () => async dispatch => dispatch(getProfileInternal())
	.then(() => dispatch(loadCoursesInternal()))
	.catch(e => console.log(e));
