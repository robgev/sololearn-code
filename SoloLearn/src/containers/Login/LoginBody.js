import React, { Component } from 'react';
import HomeIcon from 'components/HomeIcon';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { FacebookLogin } from 'react-facebook-login-component';
import { GoogleLogin } from 'react-google-login-component';
import SignupFields from './SignupFields';
import LoginFields from './LoginFields';

class LoginBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: '',
			retypePass: '',
		};
		this.submitButton = React.createRef();
	}

	componentWillReceiveProps(newProps) {
		if (newProps.currentPage !== this.props.currentPage && newProps.currentPage === 'signup') {
			this.setState({
				email: '',
				password: '',
				name: '',
				retypePass: '',
			});
		}
	}

	login = (e) => {
		e.preventDefault();
		const { email, password } = this.state;
		if (email.trim() === '' || password.trim() === '') {
			this.props.alert('Fields can\'t be empty', 'error');
		}
		this.props.credentialsLogin({ email, password });
	}

	facebookLoginRedirect = ({ accessToken }) => {
		this.props.socialLogin({ accessToken, service: 'facebook' });
	}

	signup = (e) => {
		e.preventDefault();
		Object.values(this.state).forEach((value) => {
			if (value.trim() === '') {
				this.props.alert('Fields can\'t be empty', 'error');
			}
		});
		if (this.state.password.length < 6) {
			this.props.alert('Password should be at least 6 characters long', 'error');
		} else if (this.state.password !== this.state.retypePass) {
			this.props.alert('Passwords don\'t match', 'error');
		}
		const { name, email, password: pass } = this.state;
		this.props.signup({ name, email, pass });
	}

	forgot = (e) => {
		e.preventDefault();
		const { email } = this.state;
		if (email.trim() === '') {
			this.props.alert('Fields can\'t be empty', 'error');
		}
		this.props.forgot(email);
	}

	_handleEnter = (e) => {
		if (e.key === 'Enter') {
			// Get the material-ui button, go to the underlying
			// DOM element and perform a programmatical click
			this.submitButton.current.refs.container.button.click();
		}
	}

	updateState = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		const {
 currentPage, loading, alertMessage, alertType 
} = this.props;
		const isLogin = currentPage === 'login';
		const isForgot = currentPage === 'forgot';
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
								: (isForgot
									? 'Enter your email'
									: 'Become a member of our community!'
								)
							}
							</h2>
						</div>
						{isLogin || isForgot
							? (
								<LoginFields
									email={email}
									loading={loading}
									login={this.login}
									isForgot={isForgot}
									forgot={this.forgot}
									password={password}
									alertType={alertType}
									alertMessage={alertMessage}
									updateState={this.updateState}
									handleEnter={this._handleEnter}
									submitButtonRef={this.submitButton}
								/>
							)
							: (
								<SignupFields
									name={name}
									email={email}
									loading={loading}
									signup={this.signup}
									password={password}
									retypePass={retypePass}
									alertType={alertType}
									alertMessage={alertMessage}
									updateState={this.updateState}
									handleEnter={this._handleEnter}
									submitButtonRef={this.submitButton}
								/>
							)
						}
					</div>
					<div className="option-changer">
						<RaisedButton
							secondary
							style={{ width: '50%' }}
							containerElement={<Link to={isLogin ? '/signup' : '/login'} />}
							label={isLogin ? 'Create an account' : 'Login'}
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
									responseHandler={this.facebookLoginRedirect}
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
