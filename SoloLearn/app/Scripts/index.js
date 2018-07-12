// React modules
import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from 'defaults/theme';
import { store } from 'reducers';
import { getCourses } from 'actions/learn';
import Service from 'api/service';
import 'styles/root.scss';
import routes from './config/routes';
import './i18n';

injectTapEventPlugin();
ReactGA.initialize('UA-42641357-240');
ReactGA.set({ appName: 'SoloLearn', appVersion: '0.1' });
ReactGA.ga('require', 'displayfeatures');

@connect(null, { getCourses })
class App extends PureComponent {
	componentWillMount() {
		Service.getSession()
			.then((user) => {
				if (user === null) {
					browserHistory.replace('/login');
				}
			});
		this.props.getCourses();
	}
	render() {
		return (
			<Router history={browserHistory} routes={routes} />
		);
	}
}

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
			<App />
		</MuiThemeProvider>
	</Provider>,
	document.getElementById('app'),
);
