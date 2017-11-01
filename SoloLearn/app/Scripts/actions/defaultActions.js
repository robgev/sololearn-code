import Service from '../api/service';
import Storage from '../api/storage';
import { browserHistory } from 'react-router';
import * as types from '../constants/ActionTypes';

const loadLevels = payload => ({ type: types.LOAD_LEVELS, payload });

export const getUserProfile = payload => ({ type: types.GET_USER_PROFILE, payload });

const getProfile = payload => ({ type: types.GET_PROFILE, payload });

export const clearOpenedProfile = () => getProfile(null);

const loadCourses = payload => ({ type: types.LOAD_COURSES, payload });

export const getProfileInternal = userId => async dispatch => {
    if(!userId) {
        const profile = new Storage().load('profile');
        if(profile != null) {
            dispatch(getUserProfile(profile));
        } else {
            browserHistory.replace('/login');
        }
    } else {
        const { profile } = await Service.request("Profile/GetProfile", { id: userId });
        dispatch(getProfile(profile));
    }
}

export const loadCoursesInternal = () => {
    let localStorage = new Storage(); //Caching course data
    let courses = localStorage.load("courses");
    let levels = localStorage.load("levels");

    if (courses != null || levels != null) {
        return dispatch => {
            return new Promise((resolve, reject) => {
                dispatch(loadCourses(courses));
                dispatch(loadLevels(levels));
                resolve();
            });

        }
    }
    else {
        return dispatch => {
            return Service.request("GetCourses", null).then(response => {
                localStorage.save("courses", response.courses); //Saveing data to localStorage
                localStorage.save("levels", response.levels); //Saveing data to localStorage

                dispatch(loadCourses(response.courses));
                dispatch(loadLevels(response.levels));
            }).catch(error => {
                console.log(error);
            });
        }
    }
}

export const loadDefaults = () => async dispatch => {
    return dispatch(getProfileInternal())
            .then(() => dispatch(loadCoursesInternal()))
            .catch(e => console.log(e));
}