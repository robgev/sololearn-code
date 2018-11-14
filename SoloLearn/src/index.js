// React modules
import React, { PureComponent } from 'react';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import DevTools from 'mobx-react-devtools';
import { Router, browserHistory } from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import MuiThemeProviderOld from 'material-ui/styles/MuiThemeProvider';
import Theme from 'defaults/theme';
import { store } from 'reducers';
import { getCourses } from 'actions/learn';
import { getUserProfileAsync } from 'actions/profile';
import Service from 'api/service';
import 'styles/root.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-tippy/dist/tippy.css';
import routes from './config/routes';
import './i18n';
import theme from './theme';

ReactGA.initialize('UA-42641357-240');
ReactGA.set({ appName: 'SoloLearn', appVersion: '0.1' });
ReactGA.ga('require', 'displayfeatures');

const mapStateToProps = state => ({
	isCoursesLoaded: state.courses.length > 0,
});

const shouldRedirect = (pathname) => {
	const whiteList = [ 'login', 'signup', 'forgot', 'terms-of-service', 'contact', 'faq', 'privacy' ];
	return !whiteList.find(routeName => pathname.includes(routeName));
};

@connect(mapStateToProps, { getCourses, getUserProfileAsync })
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
				if (user === null && shouldRedirect(window.location.pathname)) {
					browserHistory.replace('/login');
				} else {
					this.props.getUserProfileAsync();
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
				<React.Fragment>
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
				</React.Fragment>
			);
	}
}

const Index = () => {
	const generateClassName = createGenerateClassName();
	const jss = create({
		...jssPreset(),
		// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
		insertionPoint: document.getElementById('css-insertion-point'),
	});
	return (
		<Provider store={store}>
			<JssProvider jss={jss} generateClassName={generateClassName}>
				<MuiThemeProviderOld muiTheme={getMuiTheme(Theme)}>
					<MuiThemeProvider theme={theme}>
						<App />
					</MuiThemeProvider>
				</MuiThemeProviderOld>
			</JssProvider>
		</Provider>
	);
};

ReactDOM.render(<Index />, document.getElementById('app'));
