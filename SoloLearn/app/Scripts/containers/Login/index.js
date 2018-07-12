import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import AlertContainer from 'react-alert';

import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { login, signup, forgotPassword, logout } from 'actions/login.action';

import Login from './Login';

const mapDispatchToProps = {
	login, signup, forgotPassword, logout,
};

@connect(null, mapDispatchToProps)
class LoginContainer extends PureComponent {
	alertOptions = {
		offset: 14,
		position: 'top right',
		theme: 'dark',
		time: 2000,
		transition: 'fade',
	}

	componentWillMount() {
		document.title = 'Please log in';
		this.props.logout();
	}

	checkToFeed = (err) => {
		if (!err) {
			if (browserHistory.getCurrentLocation().pathname === '/login') {
				return browserHistory.push('/feed');
			}
		}
		return this.fault(err);
	}

	fault = err => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' '), 'info'))

	alert = (msg, type = 'error') => {
		this.msg.show(msg, {
			time: 2000, type,
		});
	}

	login = async (data) => {
		this.checkToFeed((await this.props.login(data)).err);
	}

	signup = async (data) => {
		this.checkToFeed((await this.props.signup(data).err));
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
				<AlertContainer ref={(a) => { this.msg = a; }} {...this.alertOptions} />
				<Login
					alert={this.alert}
					login={this.login}
					signup={this.signup}
					forgot={this.forgot}
				/>
			</Paper>
		);
	}
}

export default LoginContainer;
