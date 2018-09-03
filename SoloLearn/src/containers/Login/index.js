import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { toast, Bounce } from 'react-toastify';
import { connect } from 'react-redux';
import { login, signup, forgotPassword, logout } from 'actions/login.action';

import LoginBody from './LoginBody';
import './style.scss';

const mapDispatchToProps = {
	login, signup, forgotPassword, logout,
};

@connect(null, mapDispatchToProps)
class LoginContainer extends PureComponent {
	state = {
		loading: false,
	}

	toastId = 0;
	toastOptions = {
		transition: Bounce,
		autoClose: 2000,
	}

	componentDidMount() {
		document.title = 'Please log in';
	}

	checkToFeed = (err) => {
		if (!err) {
			if (browserHistory.getCurrentLocation().pathname === '/login') {
				const { url = '/feed' } = this.props.location.query;
				return browserHistory.push(url);
			}
		}
		this.setState({ loading: false });
		return this.fault(err);
	}

	fault = err => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' '), 'warn'))

	alert = (msg, type = 'error') => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast[type](`${msg}`);
		}
	}

	login = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.login(data)).err);
		} catch (e) {
			toast.error(`${e.message}`);
		}
	}

	signup = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.signup(data).err));
		} catch (e) {
			toast.error(`${e.message}`);
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
		const currentPage = this.props.location.pathname.split('/')[1];
		return (
			<div className="login-root-container">
				<LoginBody
					signup={this.signup}
					alert={this.alert}
					login={this.login}
					forgot={this.forgot}
					currentPage={currentPage}
					loading={this.state.loading}
				/>
			</div>
		);
	}
}

export default LoginContainer;
