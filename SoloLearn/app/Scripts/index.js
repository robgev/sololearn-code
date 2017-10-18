//React modules
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import Service from './api/service';
import { loadDefaults } from './actions/defaultActions';

//Redux modules
import { bindActionCreators } from 'redux';
import { store, defaultsLoaded } from './reducers';

//Additional data and components
import routes from './config/routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
    componentWillMount() {
        if(!this.props.defaultsLoaded) {
            this.props.loadDefaults();
        }
    }
    render() {
        return(
            <Router history={browserHistory} routes={routes} />
        )
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ loadDefaults }, dispatch);
}

const AppWithProps = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
    <Provider store={store}>
        <AppWithProps />
    </Provider>
    ,document.querySelector('#app')
);