// React modules
import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'styles/root.scss';
import { loadDefaults } from 'actions/defaultActions';
import { store, defaultsLoaded } from 'reducers';
import routes from './config/routes';
import './i18n';

injectTapEventPlugin();
ReactGA.initialize('UA-42641357-240');
ReactGA.set({ appName: 'SoloLearn', appVersion: '0.1' });
ReactGA.ga('require', 'displayfeatures');

const mapStateToProps = state => ({
	defaultsLoaded: defaultsLoaded(state),
});

// browserHistory.listen((location) => {
// 	console.log('HERE');
// 	ReactGA.ga('send', 'screenView', { screenName: location.pathname + location.search });
// });

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
