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
}) => (
	<div style={{ textAlign: 'right' }}>
		<form onSubmit={isForgot ? forgot : login} className="input-fields">
			<input
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				type="email"
				placeholder="Email"
			/>
			{ !isForgot &&
				<input
					required
					value={password}
					onChange={updateState}
					onKeyPress={handleEnter}
					name="password"
					type="password"
					placeholder="Password"
				/>
			}
			<RaisedButton
				type="submit"
				primary
				label="Sign In"
				disabled={loading}
				style={{ width: '40%', alignSelf: 'flex-end' }}
			/>
		</form>
		<div className="forgot-pass-container">
			<Link to="/forgot" className="forgot-pass hoverable">Forgot Password?</Link>
		</div>
	</div>
);

export default LoginFields;
