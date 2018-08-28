import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const LoginFields = ({
	email,
	login,
	password,
	updateState,
	handleEnter,
}) => (
	<div>
		<form onSubmit={login} className="input-fields">
			<input
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				type="email"
				placeholder="Email"
			/>
			<input
				required
				value={password}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="password"
				type="password"
				placeholder="Password"
			/>
			<RaisedButton
				type="submit"
				primary
				label="Sign In"
				style={{ width: '40%' }}
			/>
		</form>
		<div className="forgot-pass-container">
			<Link to="/forgot" className="forgot-pass hoverable">Forgot Password?</Link>
		</div>
	</div>
);

export default LoginFields;
