import React, { Component } from 'react';
import HomeIcon from 'components/HomeIcon';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { FacebookLogin } from 'react-facebook-login-component';
import { GoogleLogin } from 'react-google-login-component';
import SignupFields from './SignupFields';
import LoginFields from './LoginFields';

class LoginBody extends Component {
	state = {
		email: '',
		password: '',
		name: '',
		retypePass: '',
	}

	login = () => {
		const { email, password } = this.state;
		if (email === '' || password === '') {
			this.props.alert('Fields can\'t be empty', 'info');
		}
		this.props.login({ email, password });
	}

	signup = () => {
		Object.values(this.state).forEach((value) => {
			if (value === '') {
				this.props.alert('Fields can\'t be empty', 'info');
			}
		});
		if (this.state.password.length < 6) {
			this.props.alert('Password should be at least 6 characters long', 'info');
		} else if (this.state.password !== this.state.passwordRepeat) {
			this.props.alert('Passwords don\'t match', 'info');
		}
		const { name, email, password: pass } = this.state;
		this.props.signup({ name, email, pass });
	}

	forgot = () => {
		const { email } = this.state;
		if (email === '') {
			this.props.alert('Fields can\'t be empty', 'info');
		}
		this.props.forgot(email);
	}

	_handleEnter = (e) => {
		const { isLogin } = this.props;
		if (e.key === 'Enter') {
			if (isLogin) this.login();
			else this.signup();
		}
	}

	updateState = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		const { isLogin } = this.props;
		const {
			email, password, name, retypePass,
		} = this.state;
		return (
			<div className="login-body-container">
				<div className="artwork-container">
					<HomeIcon />
					<div className="artwork-info">
						<div className="info-item">
							<img src="/assets/tab_learn.png" alt="logo" />
							<p>Learn to code</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_play.png" alt="logo" />
							<p>Challenge your friends in programming battles</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_practice.png" alt="logo" />
							<p>Write code and share it with millions of users</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_discuss.png" alt="logo" />
							<p>Ask questions to the community</p>
						</div>
					</div>
				</div>
				<div className="inputs-container">
					<div className="inputs-wrapper">
						<div className="inputs-header">
							<div className="sololearn">
								<img src="/assets/logo.png" alt="logo" />
								{/* <h1>SoloLearn</h1> */}
							</div>
							<h2> {isLogin
								? 'Sign in to Sololearn'
								: 'Become a member of our community!'
							}
							</h2>
						</div>
						{isLogin
							? (
								<LoginFields
									email={email}
									password={password}
									login={this.login}
									updateState={this.updateState}
									handleEnter={this._handleEnter}
								/>
							)
							: (
								<SignupFields
									name={name}
									email={email}
									login={this.signup}
									password={password}
									retypePass={retypePass}
									updateState={this.updateState}
									handleEnter={this._handleEnter}
								/>
							)
						}
					</div>
					<div className="option-changer">
						<RaisedButton
							secondary
							style={{ width: '50%' }}
							containerElement={<Link to={isLogin ? '/signup' : '/login'} />}
							label={isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
						/>
					</div>
					<div className="social-logins">
						<div className="social-logins-wrapper">
							<div className="social-login-element facebook-login">
								<i className="fab fa-facebook-f" />
								<FacebookLogin
									socialId="153040644900826"
									language="en_US"
									scope="public_profile,email"
									responseHandler={() => { }}
									xfbml
									fields="id,email,name"
									version="v2.5"
									className="login-component"
									buttonText="Login With Facebook"
								/>
							</div>
							<div className="social-login-element google-login">
								<i className="fab fa-google" />
								<GoogleLogin
									socialId="303971375723-2de33bk4bf6n632t35nebb357aerc798.apps.googleusercontent.com"
									className="login-component"
									scope="profile"
									prompt="select_account"
									fetchBasicProfile={false}
									responseHandler={() => { }}
									buttonText="Login With Google"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default LoginBody;
