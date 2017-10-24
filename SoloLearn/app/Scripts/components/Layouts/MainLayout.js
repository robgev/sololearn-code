//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { browserHistory } from 'react-router';
import Login from '../../containers/Login';
import Auth from '../../utils/protected';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { defaultsLoaded } from '../../reducers';
import { changeLoginModal } from '../../actions/login.action';

//Additional components
import Header from '../../containers/Header/Header';
import LoadingOverlay from '../Shared/LoadingOverlay';

//Material UI components
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

//Theme
import Theme from '../../defaults/theme.js';

//Utils
import defaultSyles from '../../styles/defaults';

//Tabs
import { selectTab } from '../../actions/tabs';

//Lodash for tab selection
import { find } from 'lodash';

const muiTheme = getMuiTheme(Theme);

const styles = {
    wrapper: {
        //display: 'flex',
        //flexFlow: 'column',
        //height: '100%'
    }
}

class MainLayout extends Component {
    state = { loading: true }
    componentWillMount() {
        //find the tab for current url and select it
        this.selectTab();
        if(!this.props.defaultsLoaded || !this.props.loggedin) {
            this.props.loadDefaults()
                .then(() => this.setState({ loading: false }))
                .catch(e => console.warn(e));
        } else {
            this.setState({ loading: false });
        }
    }
    selectTab = () => {
        const { selectTab, tabs, location: { pathname } } = this.props;
        const currTab = find(tabs, tab => pathname.includes(tab.url) || tab.url.includes(pathname));
        if (currTab) {
            this.props.selectTab(currTab);
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
                            title='Please login'
                            open={this.props.loginModal}
                            onRequestClose={this.changeModalState}
                            actions={[
                                <FlatButton
                                    label='Cancel'
                                    primary
                                    onClick={this.changeModalState}
                                />
                            ]}
                        >
                            <Login />
                        </Dialog>
                        {defaultSyles}
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
        loginModal: state.loginModal
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDefaults,
        selectTab,
        changeLoginModal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth(Radium(MainLayout)));