import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const LoginFields = ({
	email,
	login,
	loading,
	password,
	updateState,
	handleEnter,
}) => (
	<div style={{ textAlign: 'right' }}>
		<div className="input-fields">
			<input
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				placeholder="Email"
			/>
			<input
				value={password}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="password"
				type="password"
				placeholder="Password"
			/>
		</div>
		<div className="forgot-pass-container">
			<Link to="/forgot" className="forgot-pass hoverable">Forgot Password?</Link>
		</div>
		<RaisedButton
			primary
			label="Sign In"
			disabled={loading}
			style={{ width: '40%' }}
			onClick={login}
		/>
	</div>
);

export default LoginFields;
