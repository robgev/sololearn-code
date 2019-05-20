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
const SlayManage = Loadable({ loader: () => import('containers/Learn/SlayManage') });
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

const UserPostDetails = Loadable({ loader: () => import('containers/UserPostDetails') });

export default ([
	<Route onEnter={() => window.scrollTo(0, 0)} path="/signin" component={Login} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/signup" component={Login} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/forgot" component={Login} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/privacy" component={Privacy} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/faq" component={Faq} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/contact" component={Contact} />,
	<Route onEnter={() => window.scrollTo(0, 0)} path="/terms-of-service" component={ToS} />,
	<Route component={redirector(MainLayout)} key="mainLayoutRoutes">
		<Redirect exact path="/" to="/feed" />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn" component={SlayHome} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/search/:query" component={SlaySearch} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/bookmarks" component={SlayBookmarks} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/more-on/:courseId" component={SlayMoreOnTopic} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/more/author/:userId" component={SlayMoreByAuthor} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/more/:collectionId" component={SlayDetailed} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/manage" component={SlayManage} />

		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/collection/:collectionId" component={SlayLessonsPage} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/lesson/:itemType/:lessonId(/:lessonName)(/:pageNumber)" component={SlayLesson} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/course/:alias" component={Modules} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/course/:alias/:moduleName" component={Lessons} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/learn/course/:alias/:moduleName/:lessonName" component={QuizManager}>
			<Route path=":quizNumber" component={Quiz} />
		</Route>

		<Route onEnter={() => window.scrollTo(0, 0)} path="/post/:id" component={UserPostDetails} />

		<Route onEnter={() => window.scrollTo(0, 0)} path="/play" component={Play} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/lesson-factory" component={LessonFactory} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/codes" component={Codes} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/settings(/:settingID)" component={Settings} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/playground(/:publicId)" component={Playground} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discuss" component={Questions} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discuss/new" component={NewQuestion} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discuss/edit/:id" component={EditQuestion} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discuss/filter/:query" component={Questions} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discuss/:id(/:questionName)(/:replyId)" component={Post} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/feed" component={Feed} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/profile/:id(/:tab)" component={Profile} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/certificate/:id" component={Certificate} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/leaderboards(/:userId)" component={Leaderboards} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/notifications" component={Notifications} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/discover(/:query)" component={DiscoverContainer} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/quiz-factory" component={QuizFactoryMenu} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/quiz-factory/suggest/:type" component={QuizFactorySuggestTypeSelector} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/quiz-factory/rate/:courseId" component={QuizFactoryRate} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="/quiz-factory/my-submissions" component={QuizFactoryMySubmissions} />
		<Route onEnter={() => window.scrollTo(0, 0)} path="*" exact component={NotFound} />
	</Route>,
]);
