//React modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

//Redux modules
import ReduxPromise from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reducers from './reducers';

//Additional data and components
import routes from './config/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(createStore);
const store = createStoreWithMiddleware(combineReducers(reducers));

/*LOGGING APPLICATION STATE*/
store.subscribe(() =>
    console.log("STORE STATE(INDEX FILE LOG): ", store.getState())
)
/******/

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>
    , document.querySelector('#app')
);