//React modules
import React from 'react';
import { Route, IndexRoute } from 'react-router';

//Layouts
import MainLayout from '../components/Layouts/MainLayout';
import EmptyLayout from '../components/Layouts/EmptyLayout';
import Login from '../containers/Login';

//Additional components
// import App from '../containers/App';

//Learn
import Modules from '../containers/Learn/Modules';
import Lessons from '../containers/Learn/Lessons';
import QuizManager from '../containers/Learn/QuizManager';
import Quiz from '../containers/Learn/Quiz';
import Shortcut from '../containers/Learn/Shortcut';

//Discuss
import Questions from '../containers/Discuss/QuestionsBase'; 
import Post from '../containers/Discuss/Post';
import NewQuestion from '../containers/Discuss/NewQuestion';
import EditQuestion from '../containers/Discuss/EditQuestion';

//Playground
import Codes from '../containers/Playground/CodesBase';
import Playground from '../containers/Playground/Playground';

//Notifications
import Notifications from '../containers/Notifications/NotificationsView';

//Feed
import Feed from '../containers/Feed/Feed';

//Profile
import Profile from '../containers/Profile/Profile';

//Chalenges
import Contests from '../containers/Challenges/Feed/Contests';
import OpponentSelector from '../containers/Challenges/Users/OpponentSelector';
import Challenge from '../containers/Challenges/Challenge/Challenge';

export default (
    [<Route component={MainLayout} key="mainLayoutRoutes">
        <Route path="/learn/:courseName/:id/shortcut(/:quizNumber)" component={Shortcut}>
            <Route component={QuizManager}>
                <IndexRoute component={Quiz} />
            </Route>
        </Route>
        <Route path="/learn/(:courseName)" component={Modules} />
        <Route path="/learn/:courseName/:moduleId(/:moduleName)" component={Lessons} />
        <Route path="/learn/:courseName/:moduleId/:moduleName/:lessonId(/:lessonName)" component={QuizManager}>
            <Route path=":quizNumber" component={Quiz} />
        </Route> 
        <Route path="/codes" component={Codes} />
        <Route path="/playground(/:primary)(/:secondary)" component={Playground} />
        <Route path="/discuss" component={Questions} />
        <Route path="/discuss/new" component={NewQuestion} />
        <Route path="/discuss/edit/:id" component={EditQuestion} />
        <Route path="/discuss/:id(/:questionName)" component={Post} />
        <Route path="/feed" component={Feed} />
        <Route path="/profile/:id(/:tab)" component={Profile} />
        <Route path="/contests" component={Contests} />
        <Route path="/choose-opponent" component={OpponentSelector} />
        <Route path="/challenge/:id" component={Challenge} />
    </Route>, 
    <Route component={EmptyLayout} key="emptyLayoutRoutes">
        <Route path="/notifications" component={Notifications} />
        <Route path="/login" component={Login} />
    </Route>
    ]
);

//<Route path="/" component={App}>     </Route>