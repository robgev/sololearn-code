import React, { PureComponent } from 'react';

import { Divider, FlatButton, RaisedButton, TextField } from 'material-ui';
import { Optional } from 'utils';

export default
class LoginPage extends PureComponent {
	state = {
		isLogin: true,
		forgot: false,
		name: '',
		email: '',
		password: '',
		passwordRepeat: '',
	}
	changeType = () => {
		if (this.state.forgot) {
			this.setState({ forgot: false });
		} else {
			this.setState({ isLogin: !this.state.isLogin });
		}
	}
	forgot = () => {
		const { email } = this.state;
		if (email === '') {
			return this.props.alert('Fields can\'t be empty', 'info');
		}
		return this.props.forgot(email);
	}
	login = () => {
		const { email, password } = this.state;
		if (email === '' || password === '') {
			return this.props.alert('Fields can\'t be empty', 'info');
		}
		this.props.login({ email, password });
	}
	signup = () => {
		Object.values(this.state).forEach((value) => {
			if (value === '') {
				return this.props.alert('Fields can\'t be empty', 'info');
			}
		});
		if (this.state.password.length < 6) {
			return this.props.alert('Password should be at least 6 characters long', 'info');
		} else if (this.state.password !== this.state.passwordRepeat) {
			return this.props.alert('Passwords don\'t match', 'info');
		}
		const { name, email, password: pass } = this.state;
		this.props.signup({ name, email, pass });
	}
	updateState = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}
	_handleEnter = (e) => {
		const { isLogin, forgot } = this.state;
		if (e.key === 'Enter') {
			if (forgot) this.forgot();
			else if (isLogin) this.login();
			else this.signup();
		}
	}
	render() {
		const { isLogin, forgot } = this.state;
		return (
			<div>
				<Optional idle={isLogin}>
					<TextField
						value={this.state.name}
						onChange={this.updateState}
						onKeyPress={this._handleEnter}
						name="name"
						floatingLabelText="name"
						underlineShow={false}
					/>
					<Divider />
				</Optional>
				<TextField
					value={this.state.email}
					onChange={this.updateState}
					onKeyPress={this._handleEnter}
					name="email"
					floatingLabelText="email"
					underlineShow={false}
				/>
				<Optional idle={forgot}>
					<Divider />
					<TextField
						value={this.state.password}
						onChange={this.updateState}
						onKeyPress={this._handleEnter}
						name="password"
						floatingLabelText="password"
						type="password"
						underlineShow={false}
					/>
				</Optional>
				<Divider style={isLogin ? { margin: 10 } : null} />
				<Optional idle={isLogin}>
					<TextField
						value={this.state.passwordRepeat}
						onChange={this.updateState}
						onKeyPress={this._handleEnter}
						name="passwordRepeat"
						floatingLabelText="repeat password"
						type="password"
						underlineShow={false}
					/>
					<Divider style={{ margin: 10 }} />
				</Optional>
				<RaisedButton
					label={forgot ? 'Request' : (isLogin ? 'Login' : 'Sign Up')}
					primary
					onClick={forgot ? this.forgot : (isLogin ? this.login : this.signup)}
				/>
				<FlatButton
					label={forgot ? 'Login' : (isLogin ? 'Sign up' : 'Login')}
					onClick={this.changeType}
				/>
				<Optional style={{ marginTop: 10 }} idle={forgot || !isLogin}>
					<FlatButton
						label="Forgot Password"
						onClick={() => this.setState({ forgot: true })}
					/>
				</Optional>
			</div>
		);
	}
}
