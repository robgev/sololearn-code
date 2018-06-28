// General
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { isEmpty } from 'lodash';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// General reducers
import activeTab from './reducer_active_tab';
import userProfile from './reducer_user';

// Learn
import courses from './reducer_courses';
import course from './reducer_course';
import levels from './reducer_levels';
import modulesMapping from './reducer_modules';
import lessonsMapping from './reducer_lessons';
import quizzesMapping from './reducer_quizzes';
import activeModuleId from './reducer_active_module';
import activeLessonId from './reducer_active_lesson';
import activeQuiz from './reducer_active_quiz';
import shortcutLesson from './reducer_shortcut';

// Playground
import codes from './reducer_codes';

// Discuss
import questions from './reducer_questions';
import discussPost from './reducer_post';
import discussFilters from './reducer_discuss_filers';

// Notifications
import notifications from './reducer_notifications';
import notificationsCount from './reducer_notifications_count';

// Feed
import feed from './reducer_feed';
import feedPins from './reducer_feed_pins';
import userSuggestions from './reducer_user_suggestions';

// Profile
import profile from './reducer_profile';

// Comments
import comments from './reducer_comments';

// Play
import challenges from './reducer_challenges';

// Login
import imitLoggedin from './login.reducer';
import loginModal from './loginModal.reducer';

// Likes
import likes from './likes.reducer';

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

const reducers = combineReducers({
	profile,
	comments,
	challenges,
	imitLoggedin,
	loginModal,
	likes,
	slay,
	settings,
	leaderboards,
	discoverSuggestions,
	// General
	activeTab,
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
	shortcutLesson,
	// Playground
	codes,
	// Discuss
	questions,
	discussPost,
	discussFilters,
	// Notifications
	notifications,
	notificationsCount,
	// Feed
	feed,
	feedPins,
	userSuggestions,
	// Quiz factory
	quizSubmission,
});

export const store = createStore(reducers, applyMiddleware(
	thunk,
	logger,
));

// Redux selector for detecting data state
export const isLoaded = (state, componentName) => {
	switch (componentName) {
	case 'loggedin':
		return state.userProfile != null;
	case 'modules':
		return state.course != null;
	case 'lessons':
		return (state.course && state.modulesMapping &&
				state.lessonsMapping && state.activeModuleId) != null;
	case 'quizzes':
		return (state.course && state.modulesMapping &&
				state.lessonsMapping && state.quizzesMapping && state.activeModuleId) != null;
	case 'shortcut':
		return (state.course && state.shortcutLesson) != null;
	case 'discuss':
		return state.questions.length > 0;
	case 'discussPost':
		return state.discussPost != null;
	case 'playground':
		return state.codes.length > 0;
	case 'notifications':
		return state.notifications.length > 0;
	case 'feed':
		return state.feed.length > 0;
	case 'profile':
		return !isEmpty(state.profile.data);
	case 'followers':
		return state.profile.followers.length > 0;
	case 'following':
		return state.profile.following.length > 0;
	case 'comments':
		return state.comments.data.length > 0;
	case 'contests':
		return state.challenges.contests != null;
	case 'opponentSelector':
		return state.challenges.courseId != null;
	case 'allPlayers':
		return state.challenges.allPlayers.length > 0;
	case 'challengesFollowers':
		return state.challenges.followers.length > 0;
	case 'challengesFollowing':
		return state.challenges.following.length > 0;
	case 'activeContest':
		return state.challenges.activeContest != null;
	case 'initallyLoaded':
		return state.courses != null && state.levels != null;
	case 'commentSelected':
		return state.comments.selected != null;
	default:
		return null;
	}
};

export const defaultsLoaded = state => (state.userProfile && state.courses && state.levels) != null;
