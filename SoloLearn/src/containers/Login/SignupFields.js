import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const SignupFields = ({
	name,
	email,
	signup,
	password,
	retypePass,
	updateState,
	handleEnter,
}) => (
	<div>
		<form onSubmit={signup} className="input-fields">
			<input
				value={name}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="name"
				placeholder="Name"
			/>
			<input
				type="email"
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
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
			<input
				required
				value={retypePass}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="retypePass"
				type="password"
				placeholder="Retype Password"
			/>
			<RaisedButton
				type="submit"
				primary
				label="Sign Up"
				style={{ width: '40%' }}
			/>
		</form>
		<div className="tos-disclaimer">
			<p>
					By signing up you agree to our <Link className="hoverable" to="/terms-of-service">Terms of Service.</Link>
			</p>
		</div>
	</div>
);

export default SignupFields;
