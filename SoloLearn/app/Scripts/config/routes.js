// React modules
import React from 'react';
import { Route, Redirect } from 'react-router';

// Layouts
import MainLayout from 'components/Layouts/MainLayout';
import Login from 'containers/Login';

// Additional components

// Slay
import SlayHome from 'containers/Learn/SlayHome';
import SlaySearch from 'containers/Learn/SlaySearch';
import SlayLesson from 'containers/Learn/SlayLesson';
import SlayDetailed from 'containers/Learn/SlayDetailed';
import SlayBookmarks from 'containers/Learn/SlayBookmarks';
import SlayMoreOnTopic from 'containers/Learn/SlayMoreOnTopic';
import SlayMoreByAuthor from 'containers/Learn/SlayMoreByAuthor';

// Learn
import CourseMore from 'containers/Learn/CourseMore';
import Lessons from 'containers/Learn/Lessons';
import QuizManager from 'containers/Learn/QuizManager';
import Quiz from 'containers/Learn/Quiz';

// Discuss
import Questions from 'containers/Discuss/Questions';
import Post from 'containers/Discuss/Post';
import NewQuestion from 'containers/Discuss/NewQuestion';
import EditQuestion from 'containers/Discuss/EditQuestion';

// Playground
import Codes from 'containers/Playground/CodesBase';
import Playground from 'containers/Playground';

// Notifications
import Notifications from 'containers/Notifications/NotificationsView';

// Settings
import Settings from 'containers/Settings';

// Feed
import Feed from 'containers/Feed/Feed';

// Certificate
import Certificate from 'containers/Certificate';

// Profile
import Profile from 'containers/Profile/Profile';

// Leaderboards
import Leaderboards from 'containers/Leaderboards';

// Discover
import DiscoverContainer from 'containers/Profile/DiscoverContainer';

import NotFound from 'components/Shared/NotFound';

import redirector from 'utils/redirector';

// Quiz factory
import {
	QuizFactoryMenu,
	QuizFactorySuggestTypeSelector,
	QuizFactoryMySubmissions,
	QuizFactoryRate,
} from 'containers/QuizFactory';

export default ([
	<Route path="/login" component={Login} />,
	<Route component={redirector(MainLayout)} key="mainLayoutRoutes">
		<Redirect exact path="/" to="/feed" />
		<Route path="/learn" component={SlayHome} />
		<Route path="/learn/search/:query" component={SlaySearch} />
		<Route path="/learn/bookmarks" component={SlayBookmarks} />
		<Route path="/learn/more-on/:courseId" component={SlayMoreOnTopic} />
		<Route path="/learn/more/author/:userId" component={SlayMoreByAuthor} />
		<Route path="/learn/more/:collectionId" component={SlayDetailed} />
		<Route path="/learn/slayLesson/:itemType/:lessonId/:pageNumber(/:language(/:codeID))" component={SlayLesson} />
		<Redirect path="/courses/:courseName/:courseId/:itemType" to="/learn/:courseName/:courseId/:itemType" />
		<Route path="/learn/:courseName/:courseId/:itemType" component={CourseMore} />
		<Route path="/learn/:courseName/:courseId/:itemType/:moduleId(/:moduleName)" component={Lessons} />
		<Route path="/learn/:courseName/:courseId/:itemType/:moduleId/:moduleName/:lessonId(/:lessonName)" component={QuizManager}>
			<Route path=":quizNumber(/:primary)(/:secondary)" component={Quiz} />
		</Route>
		<Route path="/codes" component={Codes} />
		<Route path="/settings(/:settingID)" component={Settings} />
		<Route path="/playground(/:primary)(/:secondary)" component={Playground} />
		<Route path="/discuss" component={Questions} />
		<Route path="/discuss/new" component={NewQuestion} />
		<Route path="/discuss/edit/:id" component={EditQuestion} />
		<Route path="/discuss/filter/:query" component={Questions} />
		<Route path="/discuss/:id(/:questionName)(/:replyId)" component={Post} />
		<Route path="/feed" component={Feed} />
		<Route path="/profile/:id(/:tab)(/:selected)" component={Profile} />
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
