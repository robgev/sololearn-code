// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { find } from 'lodash';

// Material UI components
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Redux modules
import { changeLoginModal } from 'actions/login.action';
import { loadDefaults } from 'actions/defaultActions';
import { defaultsLoaded } from 'reducers';
import selectTab from 'actions/tabs';
import { Auth } from 'utils';

// Additional components
import Header from 'containers/Header/Header';
import Login from 'containers/Login';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

// Theme
import Theme from 'defaults/theme';

const muiTheme = getMuiTheme(Theme);

const styles = {
	wrapper: {
		// display: 'flex',
		// flexFlow: 'column',
		// height: '100%'
	},
};

class MainLayout extends Component {
	state = { loading: true }
	componentWillMount() {
		// find the tab for current url and select it
		this.selectTab();
		if (!this.props.defaultsLoaded || !this.props.loggedin) {
			this.props.loadDefaults()
				.then(() => this.setState({ loading: false }));
		} else {
			this.setState({ loading: false });
		}
	}
	selectTab = () => {
		const { selectTab: changeTab, tabs, location: { pathname } } = this.props;
		const currTab = find(tabs, tab => pathname.includes(tab.url) || tab.url.includes(pathname));
		if (currTab) {
			changeTab(currTab);
		}
	}
	changeModalState = () => {
		this.props.changeLoginModal(!this.props.loginModal);
	}
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				{
					this.state.loading ?
						<LoadingOverlay /> :
						<div style={styles.wrapper}>
							<Dialog
								title="Please login"
								open={this.props.loginModal}
								onRequestClose={this.changeModalState}
								actions={[
									<FlatButton
										label="Cancel"
										primary
										onClick={this.changeModalState}
									/>,
								]}
							>
								<Login />
							</Dialog>
							<Header />
							{this.props.children}
						</div>
				}
			</MuiThemeProvider>
		);
	}
}

function mapStateToProps(state) {
	return {
		tabs: state.tabs,
		defaultsLoaded: defaultsLoaded(state),
		loggedin: state.loggedin,
		loginModal: state.loginModal,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		loadDefaults,
		selectTab,
		changeLoginModal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth(Radium(MainLayout)));
