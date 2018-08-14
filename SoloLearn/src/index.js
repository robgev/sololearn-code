// React modules
import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import DevTools from 'mobx-react-devtools';
import { Router, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Theme from 'defaults/theme';
import { store } from 'reducers';
import { getCourses } from 'actions/learn';
import Service from 'api/service';
import 'styles/root.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import routes from './config/routes';
import './i18n';

injectTapEventPlugin();
ReactGA.initialize('UA-42641357-240');
ReactGA.set({ appName: 'SoloLearn', appVersion: '0.1' });
ReactGA.ga('require', 'displayfeatures');

const mapStateToProps = state => ({
	isCoursesLoaded: state.courses.length > 0,
});

@connect(mapStateToProps, { getCourses })
class App extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: !props.isCoursesLoaded,
		};
	}
	componentWillMount() {
		Service.getSession()
			.then((user) => {
				if (user === null) {
					browserHistory.replace('/login');
				}
			});
		this.props.getCourses()
			.then(() => {
				if (this.state.isLoading) {
					this.setState({ isLoading: false });
				}
			});
	}
	render() {
		return this.state.isLoading
			? null
			: (
				<div>
					<DevTools />
					<Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory} routes={routes} />
					<ToastContainer
						draggable
						newestOnTop
						closeOnClick
						pauseOnHover
						hideProgressBar
						pauseOnVisibilityChange
						position="bottom-right"
						autoClose={2000}
					/>
				</div>
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
