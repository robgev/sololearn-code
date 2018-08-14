import Service from 'api/service';
import Progress from 'api/progress';
import Storage from 'api/storage';
import * as types from 'constants/ActionTypes';
import { getProfileInternal } from 'actions/profile';
import { getModuleByName } from 'reducers/reducer_modules';

const setLevels = payload => ({ type: types.LOAD_LEVELS, payload });
const setCourses = payload => ({ type: types.LOAD_COURSES, payload });

const getCoursesSync = () => (dispatch) => {
	const courses = Storage.load('courses');
	const levels = Storage.load('levels');
	if (courses !== null && levels !== null) {
		dispatch(setCourses(courses));
		dispatch(setLevels(levels));
	}
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
	dispatch(getCoursesSync());
	return dispatch(getCoursesAsync());
};

// Identifying keys of modules, lessons and quizzes objects
const normalizeCourse = modules => (dispatch) => {
	const normalizedModules = {};
	const normalizedLessons = {};
	const normalizedQuizzes = {};

	modules.forEach((mod) => {
		mod.lessons.forEach((les) => {
			les.quizzes.forEach((quiz) => {
				normalizedQuizzes[quiz.id] = quiz;
			});
			normalizedLessons[les.id] = les;
		});
		normalizedModules[mod.id] = mod;
	});

	dispatch({
		type: types.MAP_MODULES,
		payload: normalizedModules,
	});
	dispatch({
		type: types.MAP_LESSONS,
		payload: normalizedLessons,
	});
	dispatch({
		type: types.MAP_QUIZZES,
		payload: normalizedQuizzes,
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
		dispatch(normalizeCourse(course.modules));
		dispatch(loadCourse(course));
	} else {
		selectedCourseId = selectedCourseId || userCourses[0].id;
		Storage.save('selectedCourseId', selectedCourseId);
		const { course: fetchedCourse } = await Service.request('GetCourse', { id: selectedCourseId });
		Progress.courseId = fetchedCourse.id;
		Progress.loadCourse(fetchedCourse); // Getting progress of course
		await Progress.sync();
		Storage.save(`c${selectedCourseId}`, fetchedCourse); // Saveing data to localStorage
		dispatch(normalizeCourse(fetchedCourse.modules, dispatch));
		dispatch(loadCourse(fetchedCourse));
	}
};

export const selectModule = moduleId => ({
	type: types.MODULE_SELECTED,
	payload: moduleId,
});

export const selectModuleByName = name => (dispatch, getState) => {
	const { id } = getModuleByName(getState(), name);
	dispatch(selectModule(id));
};

export const selectLesson = lessonId => ({
	type: types.LESSON_SELECTED,
	payload: lessonId,
});

export const selectQuiz = quiz => ({
	type: types.QUIZ_SELECTED,
	payload: quiz,
});
