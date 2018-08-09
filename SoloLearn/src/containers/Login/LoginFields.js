import React from 'react';
import { Link } from 'react-router';
import { RaisedButton } from 'material-ui';

const LoginFields = ({
	email,
	login,
	password,
	updateState,
	handleEnter,
}) => (
	<div>
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
			style={{ width: '40%' }}
			onClick={login}
		/>
	</div>
);

export default LoginFields;
