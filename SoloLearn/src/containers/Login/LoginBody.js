import React, { Component } from 'react';
import { translate } from 'react-i18next';
import HomeIcon from 'components/HomeIcon';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { FacebookLogin } from 'react-facebook-login-component';
import { GoogleLogin } from 'react-google-login-component';
import SignupFields from './SignupFields';
import LoginFields from './LoginFields';

@translate()
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
		const { t } = this.props;
		e.preventDefault();
		const { email, password } = this.state;
		if (email.trim() === '' || password.trim() === '') {
			this.props.alert(t('login.error.wrong-credentials-title'), 'error');
		}
		this.props.credentialsLogin({ email, password });
	}

	facebookLoginRedirect = ({ accessToken }) => {
		this.props.socialLogin({ accessToken, service: 'facebook' });
	}

	googleLoginRedirect = (googleUser) => {
		const { id_token: accessToken } = googleUser.getAuthResponse();
		this.props.socialLogin({ accessToken, service: 'google' });
	}

	signup = async (e) => {
		const { t } = this.props;
		e.preventDefault();
		Object.values(this.state).forEach((value) => {
			if (value.trim() === '') {
				this.props.alert(t('login.error.wrong-credentials-title'), 'error');
			}
		});
		if (this.state.password.length < 6) {
			this.props.alert(t('auth.invalid-password'), 'error');
		} else if (this.state.password !== this.state.retypePass) {
			this.props.alert(t('register.passwords-not-match'), 'error');
		} else {
			const { name, email, password: pass } = this.state;
			await this.props.signup({ name, email, pass });
			this.props.alert(t('auth.activate-account-success'), 'info');
		}
	}

	forgot = (e) => {
		const { t } = this.props;
		e.preventDefault();
		const { email } = this.state;
		if (email.trim() === '') {
			this.props.alert(t('register.error.incorrect-email-title'), 'error');
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
		const { name, value } = e.target;
		this.setState({ [name]: value.replace(/^\s+/g, '') });
	}

	render() {
		const {
			t, currentPage, loading, alertMessage, alertType,
		} = this.props;
		const isLogin = currentPage === 'signin';
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
							<p>{t('onboarding.learn-message')}</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_play.png" alt="logo" />
							<p>{t('onboarding.play-message')}</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_practice.png" alt="logo" />
							<p>{t('onboarding.code-message')}</p>
						</div>
						<div className="info-item">
							<img src="/assets/tab_discuss.png" alt="logo" />
							<p>{t('onboarding.discuss-message')}</p>
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
							<h2> {t(isLogin
								? 'auth.signin-message'
								: (isForgot
									? 'forgot_password.message'
									: 'auth.create-new-account-title'
								))
							}
							</h2>
						</div>
						{isLogin || isForgot
							? (
								<LoginFields
									t={t}
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
									t={t}
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
							containerElement={<Link to={isLogin ? '/signup' : '/signin'} />}
							label={t(isLogin ? 'register.create-new-account-title' : 'auth.signin-title')}
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
									buttonText={t('auth.facebook-signin-title')}
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
									responseHandler={this.googleLoginRedirect}
									buttonText={t('auth.google-signin-title')}
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
