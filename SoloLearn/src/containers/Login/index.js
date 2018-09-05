import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { toast, Bounce } from 'react-toastify';
import { connect } from 'react-redux';
import { faultGenerator } from 'utils';
import { credentialsLogin, socialLogin, signup, forgotPassword, logout } from 'actions/login.action';

import LoginBody from './LoginBody';
import './style.scss';

const mapDispatchToProps = {
	credentialsLogin, socialLogin, signup, forgotPassword, logout,
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

	fault = (err, type = 'warn') => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' '), type))

	alert = (msg, type = 'error') => {
		if (!toast.isActive(this.toastId)) {
			this.toastId = toast[type](`${msg}`);
		}
	}

	credentialsLogin = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.credentialsLogin(data)).err);
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data), 'error');
		}
	}

	socialLogin = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.socialLogin(data)).err);
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data), 'error');
		}
	}

	signup = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.signup(data).err));
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data), 'error');
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
					credentialsLogin={this.credentialsLogin}
					socialLogin={this.socialLogin}
					forgot={this.forgot}
					currentPage={currentPage}
					loading={this.state.loading}
				/>
			</div>
		);
	}
}

export default LoginContainer;
