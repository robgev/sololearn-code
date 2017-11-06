import Storage from './storage';
import Service from './service';
import EnumNameMapper from '../utils/enumNameMapper';

export const ProgressState = {
	Disabled: 1,
	Active: 2,
	Normal: 3,
};
EnumNameMapper.apply(ProgressState);

export const PointExchangeTypes = {
	Hint: 1,
	Skip: 2,
};

class LessonProgress {
	constructor() {
		this.lessonID = 0;
		this.score = 0;
		this.bestScore = 0;
		this.attempt = 0;
		this.isStarted = false;
		this.isCompleted = false;
		this.activeQuizID = 0;
		this.quizzes = [];
	}
}

class QuizProgress {
	constructor() {
		this.quizID = 0;
		this.score = 0;
		this.attempt = 0;
		this.time = 0;
		this.isCompleted = false;
	}
}

class LessonState {
	constructor() {
		this._visualState = ProgressState.Disabled;
		this.points = 0;
		this.activeQuizAttempt = 1;
		this.activeQuizFrozenAttempt = 1;
		this.activeQuizID = 0;
		this.activeQuizNumber = 1;
		this.isStarted = false;
		this.isUnlocked = false;
		this.progressPercent = 0;
		this.lesson = null;
		this.stateClass = 'disabled';
	}

	get visualState() {
		return this._visualState;
	}

	set visualState(state) {
		this._visualState = state;
		this.stateClass = ProgressState.getName(this._visualState);
	}
}

class ModuleState {
	constructor() {
		this._visualState = ProgressState.Disabled;
		this._totalLessons = 0;
		this._passedItems = 0;
		this._totalItems = 0;
		this.passedLessons = 0;
		this.progress = 0;
		this.hasLessons = false;
		this.stateClass = 'disabled';
	}

	get visualState() {
		return this._visualState;
	}

	set visualState(state) {
		this._visualState = state;
		this.stateClass = ProgressState.getName(this._visualState);
	}

	get totalItems() {
		return this._totalItems;
	}

	set totalItems(items) {
		this._totalItems = items;
		this.progress = (this._totalItems == 0) ? 0 : 100.0 * this._passedItems / this._totalItems;
	}

	get passedItems() {
		return this._passedItems;
	}

	set passedItems(items) {
		this._passedItems = items;
		this.progress = (this._totalItems == 0) ? 0 : 100.0 * this._passedItems / this._totalItems;
	}

	get totalLessons() {
		return this._totalLessons;
	}

	set totalLessons(lessons) {
		this._totalLessons = lessons;
		this.hasLessons = this._totalLessons > 0;
	}
}

class ProgressManager {
	constructor(courseId) {
		if (!ProgressManager.instance) {
			ProgressManager.instance = this;
			this.progress = {};

			this.courseId = courseId;
			this.modules = [];
			this.lessons = [];
			this.localProgress = [];
			this.lessonStates = {};
			this.moduleStates = {};

			this.lessonChanges = [];
			this.quizChanges = [];
			this.pointChanges = [];

			this.progress.points = 0;
			this.progress.syncedPoints = 0;
			this.progress.percent = 0;
			this.progress.isCompleted = false;

			this.totalCompletedLessons = -1;
			this.isPushing = false;
			this.isPushQueued = false;

			this.storage = new Storage();
		}

		return ProgressManager.instance;
	}

	loadCourse(course) {
		this.modules = course.modules;
		this.lessons = [];
		for (let i = 0; i < this.modules.length; i++) {
			const l = this.modules[i].lessons;
			for (let j = 0; j < l.length; j++) {
				this.lessons.push(l[j]);
			}
		}

		for (let i = 0; i < this.modules.length; i++) {
			const state = this.moduleStates[`m${this.modules[i].id}`];
			if (state != null) {
				this.propagateModuleProgress(this.modules[i], state);
			}
		}

		this.highlightActiveLesson();
	}

	getLesson(lessonID) {
		for (let i = 0; i < this.lessons.length; i++) {
			if (this.lessons[i].id == lessonID) return this.lessons[i];
		}
		return null;
	}

	getModuleByLessonId(lessonId) {
		for (let i = 0; i < this.modules.length; i++) {
			const ml = this.modules[i];
			for (let j = 0; j < ml.lessons.length; j++) {
				const l = ml.lessons[j];
				if (l.id == lessonId) return ml;
			}
		}
		return null;
	}

	propagateModuleProgress(module, state) {
		// / <signature>
		// / <summary>Propagate progress to specified state</summary>
		// / <param name="module" type="app.models.Module">Module to propagate</param>
		// / <param name="state" type="app.models.ModuleState">ModuleState to update</param>
		// / </signature>
		const that = this;

		state.totalItems = Object.keys(module.lessons).length;
		state.totalLessons = Object.keys(module.lessons).filter(lessonId => module.lessons[lessonId].type == 0).length;
		const passedItems = Object.keys(module.lessons).filter(lessonId => that.getLessonStateById(module.lessons[lessonId].id).visualState == ProgressState.Normal);
		state.passedItems = passedItems.length;
		state.passedLessons = passedItems.filter(l => l.type == 0).length;

		if (state.passedItems == 0) {
			const moduleIndex = this.modules.indexOf(module);
			if (moduleIndex == 0) {
				state.visualState = ProgressState.Active;
			} else if (moduleIndex > 0) {
				const prevModule = this.modules[moduleIndex - 1];
				if (Object.keys(prevModule.lessons).filter(lessonId => that.getLessonStateById(prevModule.lessons[lessonId].id).visualState == ProgressState.Normal).length == prevModule.lessons.length) {
					state.visualState = ProgressState.Active;
				} else {
					state.visualState = ProgressState.Disabled;
				}
			}
		} else if (state.passedItems == state.totalItems) {
			state.visualState = ProgressState.Normal;
			const moduleIndex = this.modules.indexOf(module);
			if (moduleIndex >= 0 && moduleIndex < this.modules.length - 1) {
				const nextModule = this.modules[moduleIndex + 1];
				const nextState = this.moduleStates[`m${nextModule.id}`];
				if (nextState != null && nextState.visualState == ProgressState.Disabled) {
					nextState.visualState = ProgressState.Active;
				}
			}
		} else {
			state.visualState = ProgressState.Active;
		}
	}

	getModuleState(module) {
		// / <summary>Get State for specified module</summary>
		// / <param name="module" type="app.models.Module">Module</param>

		let state = this.moduleStates[`m${module.id}`] || null;
		if (!state) {
			state = new ModuleState();
			this.moduleStates[`m${module.id}`] = state;
			this.propagateModuleProgress(module, state);
		}
		return state;
	}

	highlightActiveLesson() {
		let prevState = ProgressState.Normal;
		for (let i = 0; i < this.lessons.length; i++) {
			const lessonState = this.getLessonState(this.lessons[i]);
			let state = lessonState.visualState;
			if (prevState == ProgressState.Normal && state == ProgressState.Disabled) {
				state = ProgressState.Active;
				lessonState.visualState = state;
				lessonState.isUnlocked = true;
			}
			prevState = state;
		}
	}

	propagateLessonProgress(lessonProgress, state) {
		// / <signature>
		// / <summary>Propagate progress to specified state</summary>
		// / <param name="lessonProgress" type="app.models.LessonProgress">LessonProgress to propagate</param>
		// / <param name="state" type="app.models.LessonState">LessonState to update</param>
		// / </signature>
		// / <signature>
		// / <summary>Propagate progress if state exists</summary>
		// / <param name="lessonProgress" type="app.models.LessonProgress">LessonProgress to propagate</param>
		// / </signature>

		if (!state) state = this.getLessonStateById(lessonProgress.lessonID);
		if (!state) return;

		state.points = Math.round(lessonProgress.bestScore);
		state.isStarted = lessonProgress.isStarted;
		if (lessonProgress.isCompleted || state.points > 0) {
			state.visualState = ProgressState.Normal;
			state.isUnlocked = true;
		}

		state.activeQuizID = lessonProgress.activeQuizID;

		let lesson = null;

		for (let i = 0; i < this.lessons.length; i++) {
			if (this.lessons[i].id == lessonProgress.lessonID) {
				lesson = this.lessons[i];
				break;
			}
		}

		const quizzes = lesson.quizzes;
		let activeQuiz = null;
		let activeQuizIndex = 0;
		for (let i = 0; i < quizzes.length; i++) {
			if (quizzes[i].id == lessonProgress.activeQuizID) {
				activeQuiz = quizzes[i];
				activeQuizIndex = i;
				state.activeQuizNumber = lesson.type == 0 ? (activeQuizIndex * 2) + 1 : activeQuizIndex + 1;
				break;
			}
		}

		if (activeQuiz != null) {
			state.progressPercent = Math.round(100.0 * activeQuizIndex / quizzes.length);
		} else {
			state.progressPercent = 0;
		}

		const activeQuizProgress = this.getQuizProgress(lessonProgress, lessonProgress.activeQuizID);

		if (activeQuizProgress != null) {
			state.activeQuizAttempt = activeQuizProgress.attempt;
		} else {
			state.activeQuizAttempt = 1;
		}

		const module = this.getModuleByLessonId(lesson.id); // get module by lessonId
		if (module != null) {
			const moduleState = this.moduleStates[`m${module.id}`] || null;
			if (moduleState != null) {
				this.propagateModuleProgress(module, moduleState);
			}
		}
	}

	getLessonProgress(lessonId) {
		for (let i = 0; i < this.localProgress.length; i++) {
			if (this.localProgress[i].lessonID == lessonId) return this.localProgress[i];
		}
		return null;
	}

	getLessonStateById(lessonId) {
		return this.lessonStates[`l${lessonId}`] || null;
	}

	getLessonState(lesson) {
		// / <summary>Get State for specified lesson</summary>
		// / <param name="lesson" type="app.models.Lesson">Lesson</param>
		let state = this.getLessonStateById(lesson.id);
		if (!state) {
			state = new LessonState();
			this.lessonStates[`l${lesson.id}`] = state;
			const progress = this.getLessonProgress(lesson.id);
			if (progress) {
				this.propagateLessonProgress(progress, state);
			}
		}
		return state;
	}

	getQuizProgress(lessonProgress, quizId) {
		for (let i = 0; i < lessonProgress.quizzes.length; i++) {
			if (lessonProgress.quizzes[i].quizID == quizId) return lessonProgress.quizzes[i];
		}
		return null;
	}

	calculateCompletionPercent(newLesson) {
		let completed = 0;
		for (let i = 0; i < this.localProgress.length; i++) {
			if (this.localProgress[i].isCompleted) completed++;
		}
		this.progress.percent = Math.round(100.0 * completed / this.lessons.length);

		this.progress.isCompleted = completed == this.lessons.length;
	}

	incrementTotalCompletedLessons(newLesson) {
		if (this.totalCompletedLessons == -1) {
			this.totalCompletedLessons = this.storage.load('totalCompletedLessons') || 0;
		}
		this.totalCompletedLessons++;
		this.storage.save('totalCompletedLessons', this.totalCompletedLessons);
		// if (totalCompletedLessons % 4 == 0) {
		//    app.executeProgressAction();
		// }
	}

	// TODO
	// app.executeProgressAction = function () {
	//    var displayed = app.Storage.load('progressActions') || [];
	//    var available = [];
	//    for (var item in app.progressActions) {
	//        available.push(item);
	//    }

	//    var diff = app.util.shuffle(available.filter(function (item) {
	//        return !displayed.some(function (test) {
	//            return test == item;
	//        });
	//    }));

	//    if (diff.length == 0) return;

	//    displayed.push(diff[0]);
	//    app.Storage.save('progressActions', displayed);

	//    var item = app.progressActions[diff[0]];

	//    switch (item.type) {
	//        case 'text':
	//            app.PopupService.showMessage(item.text);
	//            break;
	//    }
	// };

	sync() {
		return Service.request('GetProgress', { courseId: this.courseId }).then((response) => {
			const newProgress = response.progress;

			this.localProgress = [];

			for (let i = 0; i < newProgress.length; i++) {
				const lp = new LessonProgress();
				Object.assign(lp, newProgress[i]);
				const quizzes = newProgress[i].quizzes;
				for (let j = 0; j < quizzes.length; j++) {
					lp.quizzes[j] = Object.assign(new QuizProgress(), quizzes[j]);
				}
				this.localProgress.push(lp);
			}

			this.progress.points = response.xp;
			this.progress.syncedPoints = response.points;

			for (let i = 0; i < this.localProgress.length; i++) {
				this.propagateLessonProgress(this.localProgress[i]);
			}

			this.highlightActiveLesson();
			this.calculateCompletionPercent();
		});
	}

	getLessonScore(lessonProgress) {
		let score = 0;
		for (let i = 0; i < lessonProgress.quizzes.length; i++) {
			score += lessonProgress.quizzes[i].score;
		}

		return score;
	}

	addResult(lessonID, quizID, isSuccessful, time) {
		time = time || 0;
		// Get lesson
		const lesson = this.getLesson(lessonID);

		// Get progress for lesson, if exists
		let lessonProgress = this.getLessonProgress(lessonID);
		// Create one, if doesn't
		if (lessonProgress == null) {
			lessonProgress = {
				isStarted: false,
				attempt: 0,
				bestScore: 0,
				lessonID,
				score: 0,
				quizzes: [],
			};

			this.localProgress.push(lessonProgress);
		}

		// If lesson progress is not started, start it, reset points, quiz progresses and increase attempts
		if (!lessonProgress.isStarted) {
			lessonProgress.isStarted = true;
			lessonProgress.attempt++;
			lessonProgress.score = 0;
			lessonProgress.quizzes = [];
		}

		// Get quiz progress, if exists
		let quizProgress = this.getQuizProgress(lessonProgress, quizID);

		// Create one, if doesn't and save result
		if (quizProgress == null) {
			quizProgress = {
				attempt: 1,
				isCompleted: isSuccessful,
				quizID,
				time,
				score: 0,
			};
			lessonProgress.quizzes.push(quizProgress);
		} else {
			quizProgress.isCompleted = isSuccessful || quizProgress.isCompleted;
			quizProgress.time = time;
		}

		// Calculate quiz points, if successful
		if (isSuccessful) {
			const weight = 5.0 / lesson.quizzes.length; // quizCount
			quizProgress.score = weight / (quizProgress.attempt * 2 - 1);
		}
		// Increase attempts
		else {
			quizProgress.attempt++;
		}

		// Calculate lesson's current score
		lessonProgress.score = Math.round(this.getLessonScore(lessonProgress));
		lessonProgress.score = Math.min(lessonProgress.score, 6 - lessonProgress.attempt);

		const quizzes = lesson.quizzes;
		// Set active quiz id in lesson progress
		if (quizProgress.isCompleted) {
			let index;
			for (index = 0; index < quizzes.length; index++) {
				if (quizzes[index].id == quizID) {
					break;
				}
			}
			index++;
			if (index >= quizzes.length) {
				index = 0;
			}
			lessonProgress.activeQuizID = quizzes[index].id;
		} else {
			lessonProgress.activeQuizID = quizID;
		}

		// If result is successful, and quiz is last one in lesson - mark lesson as completed
		if (quizProgress.isCompleted && quizzes[quizzes.length - 1].id == quizID) {
			const wasCompleted = lessonProgress.isCompleted;
			lessonProgress.isCompleted = true;
			lessonProgress.isStarted = false;
			if (lessonProgress.score > lessonProgress.bestScore) {
				this.progress.points = this.progress.points + Math.floor(lessonProgress.score - lessonProgress.bestScore);
			}

			this.incrementTotalCompletedLessons(!wasCompleted);
		}

		// If lesson is completed, recalculate best score
		if (lessonProgress.isCompleted) {
			if (lessonProgress.score < 1) {
				lessonProgress.score = 1;
			}
			lessonProgress.bestScore = Math.max(lessonProgress.bestScore, lessonProgress.score);
		}

		// Apply changes
		this.propagateLessonProgress(lessonProgress);
		this.calculateCompletionPercent();
		this.highlightActiveLesson();
		this.lessonChanges.push(lessonProgress);
		this.quizChanges.push(quizProgress);

		this.pushChanges();

		return lessonProgress;
	}

	pushChanges() {
		if (this.isPushing) {
			this.isPushQueued = true;
			return;
		}
		this.isPushing = true;
		this.isPushQueued = false;

		const data = {
			lessonProgress: [],
			quizProgress: [],
			pointExchanges: [],
			courseId: this.courseId,
		};

		for (var i = 0; i < this.lessonChanges.length; i++) {
			data.lessonProgress.push({
				lessonID: this.lessonChanges[i].lessonID,
				score: this.lessonChanges[i].score,
				attempt: this.lessonChanges[i].attempt,
				isStarted: this.lessonChanges[i].isStarted,
				activeQuizID: this.lessonChanges[i].activeQuizID,
			});
		}

		for (var i = 0; i < this.quizChanges.length; i++) {
			data.quizProgress.push({
				quizID: this.quizChanges[i].quizID,
				score: this.quizChanges[i].score,
				attempt: this.quizChanges[i].attempt,
				time: this.quizChanges[i].time,
			});
		}

		for (var i = 0; i < this.pointChanges.length; i++) {
			data.pointExchanges.push(this.pointChanges[i]);
		}

		Service.request('PushProgress', data).then((result) => {
			if (!result.error) {
				this.lessonChanges.splice(0, result.lessons.length);
				this.quizChanges.splice(0, result.quizzes.length);
				this.pointChanges.splice(0, result.exchanges.length);
				this.progress.points = result.points;
				this.progress.syncedPoints = data.points;

				// TODO
				// if (result.achievements != null)
				// {
				//    for (var i = 0; i < result.achievements.length; i++) {
				//        app.ViewService.enqueueAchievement(result.achievements[i]);
				//    }
				// }
			}
			this.isPushing = false;
			if (this.isPushQueued) {
				this.pushChanges();
			}
		});
	}

	consumePoints(points) {
		const currentPoints = this.progress.points;
		return currentPoints >= points;
	}

	// consumePoints(quizID, points, action)
	// {
	//    var currentPoints = this.progress.points;
	//    if (currentPoints >= points)
	//    {
	//        var exchange = {
	//            quizID: quizID,
	//            points: points,
	//            action: action
	//        };
	//        this.progress.points = currentPoints - points;
	//        this.pointChanges.push(exchange);
	//        this.pushChanges();
	//        return true;
	//    }
	//    return false;
	// }

	applyHint(quizID, points, action) {
		const currentPoints = this.progress.points;
		const exchange = {
			quizID,
			points,
			action,
		};
		this.progress.points = currentPoints - points;
		this.pointChanges.push(exchange);
		this.pushChanges();
	}

	reset() {
		this.progress.points = 0;
		this.progress.syncedPoints = 0;
		this.progress.isCompleted = false;
		this.progress.percent = 0;
		this.localProgress = [];

		for (var key in this.lessonStates) {
			var state = this.lessonStates[key];
			state.points = 0;
			state.activeQuizAttempt = 1;
			state.activeQuizFrozenAttempt = 1;
			state.activeQuizID = 0;
			state.isStarted = false;
			state.isUnlocked = false;
			state.progressPercent = 0;
			state.visualState = ProgressState.Disabled;
		}
		for (var key in this.moduleStates) {
			var state = this.moduleStates[key];
			state.passedLessons = 0;
			state.passedItems = 0;
			state.visualState = ProgressState.Disabled;
		}
		this.highlightActiveLesson();
		this.propagateModuleProgress(this.modules[0], this.moduleStates[`m${this.modules[0].id}`]);
	}

	addShortcut(lp) {
		for (let i = 0; i < lp.length; i++) {
			let existed = false;
			for (let j = 0; j < this.localProgress.length; j++) {
				if (this.localProgress[j].lessonID == lp[i].lessonID) {
					existed = true;
					this.localProgress.splice(j, 1, lp[i]);
					break;
				}
			}
			if (!existed) {
				this.localProgress.push(lp[i]);
			}

			this.lessonChanges.push(lp[i]);
			const qp = lp[i].quizzes;
			for (let j = 0; j < qp.length; j++) {
				this.quizChanges.push(qp[j]);
			}
			this.propagateLessonProgress(lp[i]);
		}

		this.highlightActiveLesson();
		this.calculateCompletionPercent();

		this.pushChanges();
	}
}

const Progress = new ProgressManager();

export default Progress;
