import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const LoginFields = ({
	t,
	email,
	login,
	forgot,
	loading,
	isForgot,
	password,
	alertType,
	updateState,
	handleEnter,
	alertMessage,
	submitButtonRef,
}) => (
	<div style={{ textAlign: 'right' }}>
		<form onSubmit={isForgot ? forgot : login} className="input-fields">
			<input
				required
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				type="email"
				autoCapitalize="off"
				autoCorrect="off"
				disabled={isForgot && loading}
				placeholder={t('auth.email-placeholder')}
			/>
			{!isForgot && (
				<input
					required
					value={password}
					onChange={updateState}
					onKeyPress={handleEnter}
					name="password"
					type="password"
					placeholder={t('auth.password-placeholder')}
				/>
			)}
			{ alertMessage &&
			<div className={`alert-message ${alertType}`}>
				{alertMessage}
			</div>
			}
			<RaisedButton
				type="submit"
				primary
				disabled={loading}
				ref={submitButtonRef}
				label={t(isForgot ? 'forgot_password.send-title' : 'auth.signin-title')}
				style={{ minWidth: '40%', alignSelf: 'flex-end' }}
			/>
		</form>
		{!isForgot && (
			<div className="forgot-pass-container">
				<Link to="/forgot" className="forgot-pass hoverable">{t('login.forgot-password-title')}</Link>
			</div>
		)}
	</div>
);

export default LoginFields;
