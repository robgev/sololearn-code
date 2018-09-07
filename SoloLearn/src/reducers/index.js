// General
import { createStore, applyMiddleware, combineReducers } from 'redux';
import Storage from 'api/storage';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import userProfile from './reducer_user';

// Learn
import courses from './courses.reducer';
import levels from './reducer_levels';
import course from './reducer_course';
import modulesMapping from './reducer_modules';
import lessonsMapping from './reducer_lessons';
import quizzesMapping from './reducer_quizzes';
import activeModuleId from './reducer_active_module';
import activeLessonId from './reducer_active_lesson';
import activeQuiz from './reducer_active_quiz';

// Playground
import codes from './codes.reducer';

// Discuss
import discussPost from './reducer_post';
import discuss from './discuss.reducer';

// Notifications
import notifications from './notifications.reducer';

// Feed
import feed from './feed.reducer';
import feedPins from './reducer_feed_pins';

// Slay
import slay from './slay.reducer';

// Settings
import settings from './settings.reducer';

// Leaderboards
import leaderboards from './leaderboards.reducer';

// Discover
import discoverSuggestions from './discover.reducer';

// Quiz factory
import quizSubmission from './quizSubmission.reducer';

// Search
import searchBar from './searchBar.reducer';

// Localization
import locale from './locale.reducer';

const reducers = combineReducers({
	slay,
	settings,
	leaderboards,
	discoverSuggestions,
	// General
	userProfile,
	// Learn
	courses,
	course,
	levels,
	modulesMapping,
	lessonsMapping,
	quizzesMapping,
	activeModuleId,
	activeLessonId,
	activeQuiz,
	// Playground
	codes,
	// Discuss
	discuss,
	discussPost,
	// Notifications
	notifications,
	// Feed
	feed,
	feedPins,
	// Quiz factory
	quizSubmission,
	// Search
	searchBar,
	// Localization
	locale,
});

const initialStore = {
	courses: Storage.load('courses') || undefined,
	levels: Storage.load('levels') || undefined,
	userProfile: Storage.load('profile') || undefined,
};

export const store = createStore(
	reducers,
	initialStore,
	applyMiddleware(thunk, logger),
);

// Redux selector for detecting data state
export const isLoaded = (state, componentName) => {
	switch (componentName) {
	case 'loggedin':
		return state.userProfile !== null && state.userProfile.id !== undefined;
	case 'modules':
		return state.course != null;
	case 'lessons':
		return (state.course && state.modulesMapping &&
				state.lessonsMapping && state.activeModuleId) != null;
	case 'quizzes':
		return state.course !== null && state.modulesMapping !== null &&
				state.lessonsMapping !== null && state.quizzesMapping !== null &&
				state.activeModuleId !== null;
	case 'discuss':
		return state.questions.length > 0;
	case 'discussPost':
		return state.discussPost != null;
	case 'notifications':
		return state.notifications.length > 0;
	case 'feed':
		return state.feed.length > 0;
	case 'followers':
		return state.profile.followers.length > 0;
	case 'following':
		return state.profile.following.length > 0;
	default:
		throw new Error('Couldn\'t find the selector');
	}
};

export const defaultsLoaded = state => (state.userProfile && state.courses && state.levels) != null;
