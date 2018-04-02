// React modules
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'styles/root.scss';
import { loadDefaults } from 'actions/defaultActions';
import { store, defaultsLoaded } from 'reducers';
import routes from './config/routes';
import './i18n';
import './analytics';

injectTapEventPlugin();

const mapStateToProps = state => ({
	defaultsLoaded: defaultsLoaded(state),
});

@connect(mapStateToProps, { loadDefaults })
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

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app'),
);
