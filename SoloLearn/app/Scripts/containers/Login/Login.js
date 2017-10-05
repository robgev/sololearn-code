import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

export default
class LoginPage extends PureComponent {
    state = {
        isLogin: true,
        forgot: false,
        name: '',
        email: '',
        password: '',
        passwordRepeat: ''
    }
    changeType = () => {
        if(this.state.forgot) {
            this.setState({ forgot: false });
        } else {
            this.setState({ isLogin: !this.state.isLogin });
        }
    }
    forgot = () => {
        const { email } = this.state;
        if(email === '') {
            return this.props.alert('Fields can\'t be empty', 'info');
        }
        return this.props.forgot(email);
    }
    login = () => {
        const { email, password } = this.state;
        if(email === '' || password === '') {
            return this.props.alert('Fields can\'t be empty', 'info');
        }
        this.props.login({ email, password });
    }
    signup = () => {
        for(let key in this.state) {
            if(this.state[key] === '') {
                return this.props.alert('Fields can\'t be empty', 'info');
            }
        }
        if(this.state.password.length < 6) {
            return this.props.alert('Password should be at least 6 characters long', 'info');
        } else if(this.state.password !== this.state.passwordRepeat) {
            return this.props.alert('Passwords don\'t match', 'info');
        }
        const { name, email, password: pass } = this.state;
        this.props.signup({ name, email, pass });
    }
    updateState = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        const { isLogin, forgot } = this.state;
        return(
            <div>
                { !isLogin ? ( 
                    <div>
                        <TextField
                            value={this.state.name}
                            onChange={e => this.updateState(e)}
                            name='name'
                            floatingLabelText='name'
                            underlineShow={false}
                        />
                        <Divider />
                    </div>) : null
                }
                <TextField
                    value={this.state.email}
                    onChange={e => this.updateState(e)}
                    name='email'
                    floatingLabelText='email'
                    underlineShow={false}
                />
                { !forgot ? (
                    <div>
                        <Divider />
                        <TextField
                            value={this.state.password}
                            onChange={e => this.updateState(e)}
                            name='password'
                            floatingLabelText='password'
                            type='password'
                            underlineShow={false}
                        />
                    </div>) : null
                }
                <Divider style={isLogin ? {margin: 10} : null}/>
                { !isLogin ? (
                    <div>
                        <TextField
                        value={this.state.passwordRepeat}
                        onChange={e => this.updateState(e)}
                        name='passwordRepeat'
                        floatingLabelText='repeat password'
                        type='password'
                        underlineShow={false}
                        />
                        <Divider style={{margin: 10}}/>
                    </div>) : null 
                }
                <RaisedButton
                    label={ forgot ? 'Request' : (isLogin ? 'Login' : 'Sign Up')}
                    primary
                    onClick={forgot ? this.forgot : (isLogin ? this.login : this.signup)}
                />
                <FlatButton
                    label={ forgot ? 'Login' : (isLogin ? 'Sign up' : 'Login') }
                    onClick={this.changeType}
                />
                { isLogin && !forgot ? (
                    <FlatButton
                        label='Forgot Password'
                        onClick={() => this.setState({ forgot: true })}
                    />
                ) : null}
            </div>
        )
    }
}