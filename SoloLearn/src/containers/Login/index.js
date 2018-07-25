import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import FacebookLogin from 'react-facebook-login';
import { toast, Bounce } from 'react-toastify';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { login, signup, forgotPassword, logout } from 'actions/login.action';

import Login from './Login';

const mapDispatchToProps = {
	login, signup, forgotPassword, logout,
};

@connect(null, mapDispatchToProps)
class LoginContainer extends PureComponent {
	toastId = 0;
	toastOptions = {
		transition: Bounce,
		autoClose: 2000,
	}

	componentWillMount() {
		document.title = 'Please log in';
	}

	checkToFeed = (err) => {
		if (!err) {
			if (browserHistory.getCurrentLocation().pathname === '/login') {
				return browserHistory.push('/feed');
			}
		}
		return this.fault(err);
	}

	fault = err => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' '), 'warn'))

	alert = (msg, type = 'error') => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast[type](`⚠️${msg}`);
		}
	}

	login = async (data) => {
		try {
			this.checkToFeed((await this.props.login(data)).err);
		} catch (e) {
			toast.error(`❌${e.message}`);
		}
	}

	signup = async (data) => {
		try {
			this.checkToFeed((await this.props.signup(data).err));
		} catch (e) {
			toast.error(`❌${e.message}`);
		}
	}

	forgot = async (email) => {
		const { err } = await this.props.forgotPassword(email);
		// Will implement forgot password continuation later
		if (err) {
			this.fault(err);
		}
	}

	render() {
		return (
			<Paper
				zDepth={2}
				style={{
					width: '50%',
					margin: 'auto',
					padding: 10,
				}}
			>
				<Login
					alert={this.alert}
					login={this.login}
					signup={this.signup}
					forgot={this.forgot}
				/>
				<FacebookLogin
					appId="153040644900826"
				/>
			</Paper>
		);
	}
}

export default LoginContainer;
