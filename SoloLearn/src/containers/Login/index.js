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
		type: 'error',
		loading: false,
		alertMessage: '',
	}

	componentDidMount() {
		document.title = 'Please log in';
	}

	componentWillReceiveProps(newProps) {
		const currentPage = this.props.location.pathname.split('/')[1];
		const newPage = newProps.location.pathname.split('/')[1];
		if (newPage !== currentPage) {
			this.setState({
				type: 'error',
				alertMessage: '',
				loading: false,
			});
		}
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

	fault = err => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' ')))

	alert = (alertMessage, type = 'error') => {
		this.setState({ alertMessage, type });
	}

	credentialsLogin = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.credentialsLogin(data)).err);
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data));
		}
	}

	socialLogin = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.socialLogin(data)).err);
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data));
		}
	}

	signup = async (data) => {
		try {
			this.setState({ loading: true });
			this.checkToFeed((await this.props.signup(data).err));
		} catch (e) {
			this.setState({ loading: false });
			this.fault(faultGenerator(e.data));
		}
	}

	forgot = async (email) => {
		this.setState({ loading: true });
		const { err } = await this.props.forgotPassword(email);
		// Will implement forgot password continuation later
		if (err) {
			this.fault(faultGenerator(err.data));
			this.setState({ loading: false });
		}
		this.alert('Reset email sucessfully sent', 'info');
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
					alertType={this.state.type}
					loading={this.state.loading}
					alertMessage={this.state.alertMessage}
				/>
			</div>
		);
	}
}

export default LoginContainer;
