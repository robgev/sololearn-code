import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const SignupFields = ({
	t,
	name,
	email,
	signup,
	loading,
	password,
	alertType,
	retypePass,
	updateState,
	handleEnter,
	alertMessage,
	submitButtonRef,
}) => (
	<div style={{ textAlign: 'right' }}>
		<form onSubmit={signup} className="input-fields">
			<input
				required
				value={name}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="name"
				autoComplete="new-password"
				placeholder={t('register.name-placeholder')}
			/>
			<input
				required
				type="email"
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				autoCapitalize="off"
				autoCorrect="off"
				autoComplete="new-password"
				placeholder={t('auth.email-placeholder')}
			/>
			<input
				required
				value={password}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="password"
				type="password"
				autoComplete="new-password"
				placeholder={t('auth.password-placeholder')}
			/>
			<input
				required
				value={retypePass}
				onChange={updateState}
				onKeyPress={handleEnter}
				type="password"
				name="retypePass"
				autoComplete="new-password"

				placeholder={t('register.retype-password-placeholder')}
			/>
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
				label={t('register.signup-button-title')}
				style={{ minWidth: '40%', alignSelf: 'flex-end' }}
			/>
		</form>
		<div className="tos-disclaimer">
			<p>
				{t('register.tos-message')}<Link className="hoverable" target="_blank" to="/terms-of-service">{t('register.tos')}.</Link>
			</p>
		</div>
	</div>
);

export default SignupFields;
