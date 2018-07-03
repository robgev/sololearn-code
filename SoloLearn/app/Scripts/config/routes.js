// React modules
import React from 'react';
import { Route, Redirect, IndexRoute, browserHistory } from 'react-router';
import { redirector } from 'utils';

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
import SlayMoreByAuthor from 'containers/Learn/SlayMoreByAuthor';

// Learn
import Modules from 'containers/Learn/Modules';
import Lessons from 'containers/Learn/Lessons';
import QuizManager from 'containers/Learn/QuizManager';
import Quiz from 'containers/Learn/Quiz';

// Discuss
import Questions from 'containers/Discuss/QuestionsBase';
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

// Chalenges
import Contests from 'containers/Challenges/Feed/Contests';
import OpponentSelector from 'containers/Challenges/Users/OpponentSelector';
import Challenge from 'containers/Challenges/Challenge';

// Discover
import DiscoverContainer from 'containers/Profile/DiscoverContainer';

// Quiz factory
import {
	QuizFactoryMenu,
	QuizFactorySuggest,
	QuizFactorySuggestTypeSelector,
	QuizFactoryMySubmissions,
	QuizFactoryRate,
} from 'containers/QuizFactory';

export default (
	<Route component={MainLayout} key="mainLayoutRoutes">
		<Route path="/" onEnter={() => { browserHistory.replace('/feed'); }} />
		<Route path="/learn" component={SlayHome} />
		<Route path="/learn/search/:query" component={SlaySearch} />
		<Route path="/learn/bookmarks" component={SlayBookmarks} />
		<Route path="/learn/more/author/:userId" component={SlayMoreByAuthor} />
		<Route path="/learn/more/:collectionId" component={SlayDetailed} />
		<Route path="/learn/slayLesson/:itemType/:lessonId/:pageNumber(/:language(/:codeID))" component={SlayLesson} />
		{/* <Route path="/learn/:courseName/:id/shortcut(/:quizNumber)" component={Shortcut}>
			<Route component={QuizManager}>
				<IndexRoute component={Quiz} />
			</Route>
		</Route> */}
		<Redirect path="/courses(/:courseName)" to="/learn(/:courseName)" />
		<Redirect path="/course(/:courseName)" to="/learn(/:courseName)" />
		<Route path="/learn(/:courseName)" component={Modules} />
		<Route path="/learn/:courseName/:moduleId(/:moduleName)" component={Lessons} />
		<Route path="/learn/:courseName/:moduleId/:moduleName/:lessonId(/:lessonName)" component={QuizManager}>
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
		<Route path="/contests" component={redirector(Contests)} />
		<Route path="/choose-opponent" component={redirector(OpponentSelector)} />
		<Route path="/challenge/:id" component={redirector(Challenge)} />
		<Route path="/notifications" component={redirector(Notifications)} />
		<Route path="/discover(/:query)" component={redirector(DiscoverContainer)} />
		<Route path="/quiz-factory" component={QuizFactoryMenu} />
		<Route path="/quiz-factory/suggest" component={QuizFactorySuggest} />
		<Route path="/quiz-factory/suggest/:type" component={QuizFactorySuggestTypeSelector} />
		<Route path="/quiz-factory/rate/:courseId" component={QuizFactoryRate} />
		<Route path="/quiz-factory/my-submissions" component={QuizFactoryMySubmissions} />
		<Route path="/login" component={Login} />
	</Route>
);
