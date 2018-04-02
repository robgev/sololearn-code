import { browserHistory } from 'react-router';

import Service from 'api/service';
import Progress from 'api/progress';
import Storage from 'api/storage';
import * as types from 'constants/ActionTypes';
import { getProfileInternal } from 'actions/defaultActions';

// Identifying keys of modules, lessons and quizzes objects
const structurizeCourse = (modules, dispatch) => {
	let structuredModules = {};
	let structuredLessons = {};
	let structuredQuizzes = {};

	for (let i = 0; i < modules.length; i++) {
		const currentModule = modules[i];
		const currentModuleId = currentModule.id;

		const { lessons } = currentModule;

		for (let j = 0; j < lessons.length; j++) {
			const currentLesson = lessons[j];
			const currentLessonId = currentLesson.id;

			const { quizzes } = currentLesson;

			for (let k = 0; k < quizzes.length; k++) {
				const currentQuiz = quizzes[k];
				const currentQuizId = currentQuiz.id;
				const quizObj = {};
				quizObj[currentQuizId] = quizzes[k];
				structuredQuizzes = Object.assign(structuredQuizzes, quizObj);
			}

			const lessonObj = {};
			lessonObj[currentLessonId] = lessons[j];
			structuredLessons = Object.assign(structuredLessons, lessonObj);
		}

		const moduleObj = {};
		moduleObj[currentModuleId] = modules[i];
		structuredModules = Object.assign(structuredModules, moduleObj);
	}

	const modulesMapping = {
		type: types.MAP_MODULES,
		payload: structuredModules,
	};

	const lessonsMapping = {
		type: types.MAP_LESSONS,
		payload: structuredLessons,
	};

	const quizzesMapping = {
		type: types.MAP_QUIZZES,
		payload: structuredQuizzes,
	};

	return new Promise((resolve) => {
		dispatch(modulesMapping);
		dispatch(lessonsMapping);
		dispatch(quizzesMapping);
		resolve();
	});
};

const loadCourse = course => ({
	type: types.LOAD_COURSE,
	payload: course,
});

export const toggleCourse = skills => ({
	type: types.TOGGLE_COURSE,
	payload: skills,
});

export const toggleCourseInternal = (courseId, enable) => (dispatch, getState) => {
	const profile = getState().userProfile;

	return Service.request('Profile/ToggleCourse', { courseId, enable }).then(() => {
		if (!enable) {
			const index = profile.skills.findIndex(item => item.id === courseId);
			profile.skills.splice(index, 1);
			dispatch(toggleCourse(profile.skills));
		} else {
			dispatch(getProfileInternal());
		}
	}).catch((error) => {
		console.log(error);
	});
};

export const loadCourseInternal = courseId => (dispatch, getState) => {
	const localStorage = new Storage(); // Caching course data
	let selectedCourseId = courseId || localStorage.load('selectedCourseId');
	const course = localStorage.load(`c${selectedCourseId}`);
	const store = getState();
	const userCourses = store.userProfile.skills;

	if (selectedCourseId && userCourses.findIndex(item => item.id === selectedCourseId) === -1) {
		dispatch(toggleCourseInternal(selectedCourseId, true));
	}

	if (course != null) {
		localStorage.save('selectedCourseId', course.id);
		return new Promise((resolve) => {
			Progress.courseId = course.id;
			Progress.loadCourse(course); // Getting progress of course
			Progress.sync().then(() => {
				structurizeCourse(course.modules, dispatch).then(() => {
					dispatch(loadCourse(course));
					resolve();
				}).catch((error) => {
					console.log(error);
				});
			}).catch((error) => {
				console.log(error);
			});
		});
	}
	selectedCourseId = selectedCourseId || userCourses[0].id;

	localStorage.save('selectedCourseId', selectedCourseId);
	return Service.request('GetCourse', { id: selectedCourseId }).then((response) => {
		const { course } = response;
		Progress.courseId = course.id;
		Progress.loadCourse(course); // Getting progress of course
		Progress.sync().then(() => {
			localStorage.save(`c${selectedCourseId}`, course); // Saveing data to localStorage
			structurizeCourse(course.modules, dispatch).then(() =>
				new Promise((resolve) => {
					dispatch(loadCourse(course));
					resolve();
				})).catch((error) => {
				console.log(error);
			});
		}).catch((error) => {
			console.log(error);
		});
	}).catch((error) => {
		console.log(error);
	});
};

export const selectModule = moduleId => ({
	type: types.MODULE_SELECTED,
	payload: moduleId,
});

export const selectLesson = lessonId => ({
	type: types.LESSON_SELECTED,
	payload: lessonId,
});

export const selectQuiz = quiz => ({
	type: types.QUIZ_SELECTED,
	payload: quiz,
});

export const setShortcutLesson = lesson => ({
	type: types.SET_SHORTCUT_LESSON,
	payload: lesson,
});
