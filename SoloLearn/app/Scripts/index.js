// React modules
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Service from 'api/service';
import { loadDefaults } from 'actions/defaultActions';
import { store, defaultsLoaded } from 'reducers';
import routes from './config/routes';

injectTapEventPlugin();

class App extends PureComponent {
	componentWillMount() {
		const { defaultsLoaded, loadDefaults } = this.props;
		if (!defaultsLoaded) {
			loadDefaults();
		}
	}
	render() {
		return (
			<Router history={browserHistory} routes={routes} />
		);
	}
}

const mapStateToProps = state => ({
	defaultsLoaded: defaultsLoaded(state),
});

const AppWithProps = connect(mapStateToProps, { loadDefaults })(App);

ReactDOM.render(
	<Provider store={store}>
		<AppWithProps />
	</Provider>,
	document.getElementById('app'),
);
