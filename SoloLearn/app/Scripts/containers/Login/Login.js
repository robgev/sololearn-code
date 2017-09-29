import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, login } from '../../actions/login.action';

import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class Login extends PureComponent {
    state = {
        email: '',
        password: ''
    }
    componentWillMount() {
        this.props.logout();
    }
    updateState = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    login = () => {
        this.props.login(this.state.email, this.state.password)
            .then(() => browserHistory.push('/feed'))
            .catch(e => console.log(e));
    }
    render() {
        return(
            <Paper
                zDepth={2}
                style={{
                    width: '50%',
                    margin: 'auto',
                    padding: 10
                }}
            >
                <TextField
                    value={this.state.email}
                    onChange={e => this.updateState(e)}
                    name='email'
                    floatingLabelText='email'
                    underlineShow={false}
                />
                <Divider />
                <TextField
                    value={this.state.password}
                    onChange={e => this.updateState(e)}
                    name='password'
                    floatingLabelText='password'
                    type='password'
                    underlineShow={false}
                />
                <Divider style={{margin: 10}}/>
                <RaisedButton
                    label='Login'
                    primary
                    onClick={this.login}
                />
            </Paper>
        )
    }
}

const mapStateToProps = ({ loggedIn }) => {
    return { loggedIn }
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        logout,
        login
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);