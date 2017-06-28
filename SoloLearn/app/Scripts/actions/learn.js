import Service from '../api/service';
import Progress from '../api/progress';
import Storage from '../api/storage';
import * as types from '../constants/ActionTypes';
import { getProfileInternal } from '../actions/defaultActions';

//Identifying keys of modules, lessons and quizzes objects
const structurizeCourse = (modules, dispatch) => {
    let structuredModules = {};
    let structuredLessons = {};
    let structuredQuizzes = {};

    for(let i = 0; i < modules.length; i++) {
        let currentModule = modules[i];
        let currentModuleId = currentModule.id;

        let lessons = currentModule.lessons;
        
        for(let j = 0; j < lessons.length; j++) {
            let currentLesson = lessons[j];
            let currentLessonId = currentLesson.id;

            let quizzes = currentLesson.quizzes;

            for(let k = 0; k < quizzes.length; k++) {
                let currentQuiz = quizzes[k];
                let currentQuizId = currentQuiz.id;
                let quizObj = {};
                quizObj[currentQuizId] = quizzes[k];
                structuredQuizzes = Object.assign(structuredQuizzes, quizObj);
            }

            let lessonObj = {};
            lessonObj[currentLessonId] = lessons[j];
            structuredLessons = Object.assign(structuredLessons, lessonObj);
        }
       
        let moduleObj = {};
        moduleObj[currentModuleId] = modules[i];
        structuredModules = Object.assign(structuredModules, moduleObj);
    }

    const modulesMapping = {
        type: types.MAP_MODULES,
        payload: structuredModules
    }

    const lessonsMapping = {
        type: types.MAP_LESSONS,
        payload: structuredLessons
    }

    const quizzesMapping = {
        type: types.MAP_QUIZZES,
        payload: structuredQuizzes
    }

    return new Promise((resolve, reject) => {
        dispatch(modulesMapping);
        dispatch(lessonsMapping);
        dispatch(quizzesMapping); 
        resolve();
    });
}

export const loadCourse = (course) => {
    return {
        type: types.LOAD_COURSE,
        payload: course
    }
}

export const loadCourseInternal = (courseId) => {
    let localStorage = new Storage(); //Caching course data
    let selectedCourseId = courseId || localStorage.load("selectedCourseId");
    const course = localStorage.load("c" + selectedCourseId);

    return (dispatch, getState) => {
        dispatch(loadCourse(null));
        const store = getState();
        const userCourses = store.userProfile.skills;

        if(selectedCourseId && userCourses.findIndex(item => item.id == selectedCourseId) == -1) {
            dispatch(toggleCourseInternal(selectedCourseId, true));
        }

        if(course != null) {
            localStorage.save("selectedCourseId", course.id);

            return new Promise((resolve, reject) => {
                Progress.courseId = course.id;
                Progress.loadCourse(course); //Getting progress of course
                Progress.sync().then(response => {
                    structurizeCourse(course.modules, dispatch).then(() => {
                            dispatch(loadCourse(course));                           
                            resolve();
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            });
        }
        else {
            selectedCourseId = selectedCourseId || userCourses[0].id;

            localStorage.save("selectedCourseId", selectedCourseId);

            return Service.request("GetCourse", { id: selectedCourseId }).then(response => {
                const course = response.course;
                Progress.courseId = course.id;
                Progress.loadCourse(course); //Getting progress of course
                Progress.sync().then(response => {
                    localStorage.save("c" + selectedCourseId, course); //Saveing data to localStorage
                    structurizeCourse(course.modules, dispatch).then(() => {
                        return new Promise((resolve, reject) => {
                            dispatch(loadCourse(course));
                            resolve();
                        });
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }
}

export const toggleCourse = (skills) => {
    return {
        type: types.TOGGLE_COURSE,
        payload: skills
    }
}

export const toggleCourseInternal = (courseId, enable) => {
    return (dispatch, getState) => {
        const profile = getState().userProfile;

        return Service.request("Profile/ToggleCourse", { courseId: courseId, enable: enable }).then(response => {
            if(!enable) {
                let index = profile.skills.findIndex(item => item.id == courseId);
                profile.skills.splice(index, 1);
                dispatch(toggleCourse(profile.skills));
            }
            else {
                dispatch(getProfileInternal());
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}

export const selectModule = (moduleId) => {
    return {
        type: types.MODULE_SELECTED,
        payload: moduleId
    }
}

export const selectLesson = (lessonId) => {
    return {
        type: types.LESSON_SELECTED,
        payload: lessonId
    }
}

export const selectQuiz = (quiz) => {
    return {
        type: types.QUIZ_SELECTED,
        payload: quiz
    }
}

export const setShortcutLesson = (lesson) => {
    return {
        type: types.SET_SHORTCUT_LESSON,
        payload: lesson
    }
}
