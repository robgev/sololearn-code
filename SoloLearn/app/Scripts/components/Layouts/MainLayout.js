// React modules
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// Material UI components
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Redux modules
import { changeLoginModal } from 'actions/login.action';
import { loadDefaults } from 'actions/defaultActions';
import { defaultsLoaded } from 'reducers';
import { Auth } from 'utils';

// Additional components
import Header from 'containers/Header/Header';
import Login from 'containers/Login';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

// Theme
import Theme from 'defaults/theme';

const styles = {
	wrapper: {
		paddingTop: 50,
	},
};

const mapStateToProps = state => ({
	tabs: state.tabs,
	loggedin: state.loggedin,
	loginModal: state.loginModal,
	defaultsLoaded: defaultsLoaded(state),
});

const mapDispatchToProps = {
	loadDefaults,
	changeLoginModal,
};

 @connect(mapStateToProps, mapDispatchToProps)
 @Auth
class MainLayout extends PureComponent {
	state = { loading: true }

	async componentWillMount() {
		if (!this.props.defaultsLoaded || !this.props.loggedin) {
			await this.props.loadDefaults();
		}
		this.setState({ loading: false });
	}

	changeModalState = () => {
		this.props.changeLoginModal(!this.props.loginModal);
	}

	render() {
		const { location: { pathname } } = this.props;
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
				{
					this.state.loading ?
						<LoadingOverlay /> :
						<div>
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
							<Header pathname={pathname} />
							<div style={styles.wrapper}>
								{this.props.children}
							</div>
						</div>
				}
			</MuiThemeProvider>
		);
	}
 }

export default MainLayout;
