import Service from 'api/service';
import Progress from 'api/progress';
import Storage from 'api/storage';
import * as types from 'constants/ActionTypes';
import { getProfileInternal } from 'actions/profile';

const setLevels = payload => ({ type: types.LOAD_LEVELS, payload });
const setCourses = payload => ({ type: types.LOAD_COURSES, payload });

const getCoursesSync = () => (dispatch) => {
	const courses = Storage.load('courses');
	const levels = Storage.load('levels');
	if (courses !== null && levels !== null) {
		dispatch(setCourses(courses));
		dispatch(setLevels(levels));
		return true;
	}
	return false;
};

const getCoursesAsync = () => async (dispatch) => {
	const { courses, levels } = await Service.request('GetCourses');
	if (courses && levels) {
		Storage.save('courses', courses);
		Storage.save('levels', levels);
		dispatch(setCourses(courses));
		dispatch(setLevels(levels));
	}
};

export const getCourses = () => (dispatch) => {
	dispatch(getCoursesAsync());
	return dispatch(getCoursesSync());
};

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
	const { userProfile: profile } = getState();

	return Service.request('Profile/ToggleCourse', { courseId, enable }).then(() => {
		if (!enable) {
			const index = profile.skills.findIndex(item => item.id === courseId);
			profile.skills.splice(index, 1);
			dispatch(toggleCourse(profile.skills));
		} else {
			dispatch(getProfileInternal(profile.id));
		}
	}).catch((error) => {
		console.log(error);
	});
};

export const loadCourseInternal = courseId => async (dispatch, getState) => {
	let selectedCourseId = courseId || Storage.load('selectedCourseId');
	const course = Storage.load(`c${selectedCourseId}`);
	const store = getState();
	const userCourses = store.userProfile.skills;

	if (selectedCourseId && userCourses.findIndex(item => item.id === selectedCourseId) === -1) {
		dispatch(toggleCourseInternal(selectedCourseId, true));
	}
	if (course != null) {
		Storage.save('selectedCourseId', course.id);
		Progress.courseId = course.id;
		Progress.loadCourse(course); // Getting progress of course
		await Progress.sync();
		await structurizeCourse(course.modules, dispatch);
		dispatch(loadCourse(course));
	} else {
		selectedCourseId = selectedCourseId || userCourses[0].id;
		Storage.save('selectedCourseId', selectedCourseId);
		const { course: fetchedCourse } = await Service.request('GetCourse', { id: selectedCourseId });
		Progress.courseId = fetchedCourse.id;
		Progress.loadCourse(fetchedCourse); // Getting progress of course
		await Progress.sync();
		Storage.save(`c${selectedCourseId}`, fetchedCourse); // Saveing data to localStorage
		await structurizeCourse(fetchedCourse.modules, dispatch);
		dispatch(loadCourse(fetchedCourse));
	}
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
