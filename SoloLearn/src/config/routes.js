// React modules
import React from 'react';
import { Route, Redirect } from 'react-router';
import { Loadable, redirector } from 'utils';

// Layouts
import MainLayout from 'components/Layouts/MainLayout';

// Feed, no need to code split as this is the default page
import Feed from 'containers/Feed/Feed';

// Learn, no need to code split as the chunk is too small and most used
import Modules from 'containers/Learn/Modules';
import SlayLessonsPage from 'containers/Learn/SlayLessonsPage';
import Lessons from 'containers/Learn/Lessons';
import QuizManager from 'containers/Learn/QuizManager';
import Quiz from 'containers/Learn/Quiz';

// Playground is code splitted (see: Playground/AsyncPlayground.js)
import Playground from 'containers/Playground';

const Login = Loadable({ loader: () => import('containers/Login') });

// Slay
const SlayHome = Loadable({ loader: () => import('containers/Learn/SlayHome') });
const SlaySearch = Loadable({ loader: () => import('containers/Learn/SlaySearch') });
const SlayLesson = Loadable({ loader: () => import('containers/Learn/SlayLesson') });
const SlayDetailed = Loadable({ loader: () => import('containers/Learn/SlayDetailed') });
const SlayBookmarks = Loadable({ loader: () => import('containers/Learn/SlayBookmarks') });
const SlayMoreOnTopic = Loadable({ loader: () => import('containers/Learn//SlayMoreOnTopic') });
const SlayMoreByAuthor = Loadable({ loader: () => import('containers/Learn/SlayMoreByAuthor') });

// Discuss
const Questions = Loadable({ loader: () => import('containers/Discuss/Questions') });
const Post = Loadable({ loader: () => import('containers/Discuss/Post/index') });
const NewQuestion = Loadable({ loader: () => import('containers/Discuss/NewQuestion') });
const EditQuestion = Loadable({ loader: () => import('containers/Discuss/EditQuestion') });

// Playground
const Codes = Loadable({ loader: () => import('containers/Playground/CodesBase') });

// Notifications
const Notifications = Loadable({ loader: () => import('containers/Notifications/NotificationsView') });

// Settings
const Settings = Loadable({ loader: () => import('containers/Settings') });

// Certificate
const Certificate = Loadable({ loader: () => import('containers/Certificate') });

// Profile
const Profile = Loadable({ loader: () => import('containers/Profile/Profile') });

// Leaderboards
const Leaderboards = Loadable({ loader: () => import('containers/Leaderboards') });

// Discover
const DiscoverContainer = Loadable({ loader: () => import('containers/Profile/DiscoverContainer') });

const Play = Loadable({ loader: () => import('containers/Play') });
const LessonFactory = Loadable({ loader: () => import('containers/LessonFactory') });

const NotFound = Loadable({ loader: () => import('components/NotFound') });
const Privacy = Loadable({ loader: () => import('components/StaticPages/Privacy') });
const Faq = Loadable({ loader: () => import('components/StaticPages/Faq') });
const Contact = Loadable({ loader: () => import('components/StaticPages/Contact') });
const ToS = Loadable({ loader: () => import('components/StaticPages/TOS') });

// Quiz factory
const QuizFactoryMenu = Loadable({
	loader: () => import('containers/QuizFactory').then(mod => mod.QuizFactoryMenu),
});
const QuizFactorySuggestTypeSelector = Loadable({
	loader: () => import('containers/QuizFactory').then(mod => mod.QuizFactorySuggestTypeSelector),
});
const QuizFactoryMySubmissions = Loadable({
	loader: () => import('containers/QuizFactory').then(mod => mod.QuizFactoryMySubmissions),
});
const QuizFactoryRate = Loadable({
	loader: () => import('containers/QuizFactory').then(mod => mod.QuizFactoryRate),
});

export default ([
	<Route path="/signin" component={Login} />,
	<Route path="/signup" component={Login} />,
	<Route path="/forgot" component={Login} />,
	<Route path="/privacy" component={Privacy} />,
	<Route path="/faq" component={Faq} />,
	<Route path="/contact" component={Contact} />,
	<Route path="/terms-of-service" component={ToS} />,
	<Route component={redirector(MainLayout)} key="mainLayoutRoutes">
		<Redirect exact path="/" to="/feed" />
		<Route path="/learn" component={SlayHome} />
		<Route path="/learn/search/:query" component={SlaySearch} />
		<Route path="/learn/bookmarks" component={SlayBookmarks} />
		<Route path="/learn/more-on/:courseId" component={SlayMoreOnTopic} />
		<Route path="/learn/more/author/:userId" component={SlayMoreByAuthor} />
		<Route path="/learn/more/:collectionId" component={SlayDetailed} />

		<Route path="/learn/collection/:collectionId" component={SlayLessonsPage} />
		<Route path="/learn/lesson/:itemType/:lessonId(/:lessonName)(/:pageNumber)" component={SlayLesson} />
		<Route path="/learn/course/:courseName" component={Modules} />
		<Route path="/learn/course/:courseName/:moduleName" component={Lessons} />
		<Route path="/learn/course/:courseName/:moduleName/:lessonName" component={QuizManager}>
			<Route path=":quizNumber" component={Quiz} />
		</Route>
		<Route path="/play" component={Play} />
		<Route path="/lesson-factory" component={LessonFactory} />
		<Route path="/codes" component={Codes} />
		<Route path="/settings(/:settingID)" component={Settings} />
		<Route path="/playground(/:publicId)" component={Playground} />
		<Route path="/discuss" component={Questions} />
		<Route path="/discuss/new" component={NewQuestion} />
		<Route path="/discuss/edit/:id" component={EditQuestion} />
		<Route path="/discuss/filter/:query" component={Questions} />
		<Route path="/discuss/:id(/:questionName)(/:replyId)" component={Post} />
		<Route path="/feed" component={Feed} />
		<Route path="/profile/:id(/:tab)" component={Profile} />
		<Route path="/certificate/:id" component={Certificate} />
		<Route path="/leaderboards(/:userId)(/:mode)(/:range)" component={Leaderboards} />
		<Route path="/notifications" component={Notifications} />
		<Route path="/discover(/:query)" component={DiscoverContainer} />
		<Route path="/quiz-factory" component={QuizFactoryMenu} />
		<Route path="/quiz-factory/suggest/:type" component={QuizFactorySuggestTypeSelector} />
		<Route path="/quiz-factory/rate/:courseId" component={QuizFactoryRate} />
		<Route path="/quiz-factory/my-submissions" component={QuizFactoryMySubmissions} />
		<Route path="*" exact component={NotFound} />
	</Route>,
]);
