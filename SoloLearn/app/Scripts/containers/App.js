//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../actions/defaultActions';
import { defaultsLoaded } from '../reducers';

//Additional components
import Header from '../containers/Header/Header';

//Material UI components
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//Theme
import Theme from '../defaults/theme.js';

//Utils
import defaultSyles from '../styles/defaults';

const muiTheme = getMuiTheme(Theme);

class App extends Component {
    componentWillMount() {
        if(!this.props.defaultsLoaded) {
            this.props.loadDefaults();
        }
    }
    render() {
        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <div>
                {defaultSyles}
                <Header />
                {this.props.children}
            </div>
          </MuiThemeProvider>
        );
    }
}

function mapStateToProps(state) {
    return {
        defaultsLoaded: defaultsLoaded(state)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        loadDefaults: loadDefaults
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(App));