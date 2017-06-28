import Service from '../api/service';
import Storage from '../api/storage';
import * as types from '../constants/ActionTypes';

export const getUserProfile = (profile) => {
    return {
        type: types.GET_USER_PROFILE,
        payload: profile
    }
}

export const getProfile = (profile) => {
    return {
        type: types.GET_PROFILE,
        payload: profile
    }
}

export const getProfileInternal = (userId) => {
    if (!userId) {
        let localStorage = new Storage(); //Caching course data
        let profile = localStorage.load("profile");

        if (profile != null && profile.id == 24379) {
            return dispatch => {
                return new Promise((resolve, reject) => {
                    dispatch(getUserProfile(profile));
                    resolve();
                });
            }
        }
        else {
            return dispatch => {
                return Service.request("Profile/GetProfile", { id: 24379 }).then(response => { //TODO
                    localStorage.save("profile", response.profile); //Saveing data to localStorage

                    dispatch(getUserProfile(response.profile));
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
                    dispatch(getProfile(response.profile));
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
}

export const loadLevels = (levels) => {
    return {
        type: types.LOAD_LEVELS,
        payload: levels
    }
}

export const loadCourses = (courses) => {
    return {
        type: types.LOAD_COURSES,
        payload: courses
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

let promise = null;

export const loadDefaults = () => {
    return dispatch => {
        return promise || (promise = new Promise((resolve, reject) => {
            dispatch(getProfileInternal()).then((response) => {
                dispatch(loadCoursesInternal()).then(() => {
                    resolve();
                    promise = null;
                });
            });
        }).catch((error) => {
            console.log(error);
        }));
    }
}