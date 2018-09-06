import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const LoginFields = ({
	email,
	login,
	forgot,
	loading,
	isForgot,
	password,
	updateState,
	handleEnter,
	errorMessage,
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
				placeholder="Email"
			/>
			{!isForgot && (
				<input
					required
					value={password}
					onChange={updateState}
					onKeyPress={handleEnter}
					name="password"
					type="password"
					placeholder="Password"
				/>
			)}
			{ errorMessage &&
			<div className="error-message">
				{errorMessage}
			</div>
			}
			<RaisedButton
				type="submit"
				primary
				disabled={loading}
				ref={submitButtonRef}
				label={isForgot ? 'Send' : 'Sign In'}
				style={{ width: '40%', alignSelf: 'flex-end' }}
			/>
		</form>
		{!isForgot && (
			<div className="forgot-pass-container">
				<Link to="/forgot" className="forgot-pass hoverable">Forgot Password?</Link>
			</div>
		)}
	</div>
);

export default LoginFields;
