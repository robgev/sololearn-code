import Service from '../api/service';
import Storage from '../api/storage';
import * as types from '../constants/ActionTypes';

const loadLevels = payload => ({ type: types.LOAD_LEVELS, payload });

const getUserProfile = payload => ({ type: types.GET_USER_PROFILE, payload });

const getProfile = payload => ({ type: types.GET_PROFILE, payload });

const loadCourses = payload => ({ type: types.LOAD_COURSES, payload });

export const getProfileInternal = (userId) => {
    if (!userId) {
        let localStorage = new Storage(); //Caching course data
        let profile = localStorage.load("profile");
        if (profile != null) {
            return dispatch => {
                return new Promise((resolve, reject) => {
                    dispatch(getUserProfile(profile));
                    resolve();
                });
            }
        }
        else {
            return (dispatch, getState) => {
                return Service.request("Profile/GetProfile", { id: getState().loggedin }).then(response => { //TODO
                    localStorage.save("profile", response.profile); //Saveing data to localStorage
                    dispatch(getProfileInternal());
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
    else {
        if (userId == 24379) { // keep Service user id
            return (dispatch, getState) => {
                const store = getState();
                const profile = store.userProfile;
                return new Promise((resolve, reject) => {
                    dispatch(getProfile(profile));
                    resolve();
                });
            }
        }
        else {
            return dispatch => {
                return Service.request("Profile/GetProfile", { id: userId }).then(response => { //TODO
                    console.log('profile response => ', response)
                    dispatch(getProfile(response.profile));
                }).catch(error => {
                    console.log(error);
                });
            }
        }
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

export const loadDefaults = () => {
    return (dispatch, getState) => {
        return dispatch(getProfileInternal())
                .then(() => dispatch(loadCoursesInternal()))
                .catch(e => console.log(e));
    }
}