//General reducers
import TabsReducer from './reducer_tabs';
import ActiveTabReducer from './reducer_active_tab';
import UserReducer from './reducer_user';

//Learn reducers
import CoursesReducer from './reducer_courses';
import CourseReducer from './reducer_course';
import LevelsReducer from './reducer_levels';
import ModulesReducer from './reducer_modules';
import LessonsReducer from './reducer_lessons';
import QuizzesReducer from './reducer_quizzes';
import ActiveModuleReducer from './reducer_active_module';
import ActiveLessonReducer from './reducer_active_lesson';
import ActiveQuizReducer from './reducer_active_quiz';
import ShortcutReducer from './reducer_shortcut';

//Playground reducers
import Codes from './reducer_codes';

//Discuss reducers
import Questions from './reducer_questions';
import Post from './reducer_post';

//Notifications reducers
import Notifications from './reducer_notifications';
import NotificationsCount from './reducer_notifications_count';

//Feed reducers
import Feed from './reducer_feed';
import FeedPins from './reducer_feed_pins';
import UserSuggestions from './reducer_user_suggestions';

//Profile
import ProfileReducer from './reducer_profile';

//Comments
import CommentsReducer from './reducer_comments';

const reducers = {
    tabs: TabsReducer,
    activeTab: ActiveTabReducer,
    courses: CoursesReducer,
    levels: LevelsReducer,
    course: CourseReducer,
    modulesMapping: ModulesReducer,
    lessonsMapping: LessonsReducer,
    quizzesMapping: QuizzesReducer,
    activeModuleId: ActiveModuleReducer,
    activeLessonId: ActiveLessonReducer,
    activeQuiz: ActiveQuizReducer,
    shortcutLesson: ShortcutReducer,
    questions: Questions,
    discussPost: Post,
    codes: Codes,
    notifications: Notifications,
    notificationsCount: NotificationsCount,
    feed: Feed,
    feedPins: FeedPins,
    userSuggestions: UserSuggestions,
    userProfile: UserReducer,
    profile: ProfileReducer,
    comments: CommentsReducer
};

// Redux selector for detecting data state
export const isLoaded = (state, componentName) => {
    switch(componentName) {
        case "modules":
            return state.course != null;
        case "lessons":
            return (state.course && state.modulesMapping && state.lessonsMapping && state.activeModuleId) != null;
        case "quizzes":
            return (state.course && state.modulesMapping && state.lessonsMapping && state.quizzesMapping && state.activeModuleId && state.activeLessonId && state.activeQuiz) != null;
        case "shortcut":
            return (state.course && state.shortcutLesson) != null;
        case "discuss":
            return state.questions.length > 0;
        case "discussPost":
            return state.discussPost != null;
        case "playground":
            return state.codes.length > 0;
        case "notifications":
            return state.notifications.length > 0;
        case "feed":
            return state.feed.length > 0;
        case "profile":
            return state.profile.data != null;
        case "followers":
            return state.profile.followers.length > 0;
        case "following":
            return state.profile.following.length > 0;
        case "comments":
            return state.comments.length > 0;
    }
}

export const defaultsLoaded = (state) => {
    return (state.userProfile && state.courses && state.levels) != null;
}

export default reducers;