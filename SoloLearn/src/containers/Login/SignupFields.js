import React from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const SignupFields = ({
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
				placeholder="Name"
			/>
			<input
				required
				type="email"
				value={email}
				onChange={updateState}
				onKeyPress={handleEnter}
				name="email"
				placeholder="Email"
				autoCapitalize="off"
				autoCorrect="off"
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
			{ alertMessage &&
			<div className={`alert-message ${alertType}`}>
				{alertMessage}
			</div>
			}
			<RaisedButton
				type="submit"
				primary
				disabled={loading}
				label="Sign Up"
				ref={submitButtonRef}
				style={{ width: '40%', alignSelf: 'flex-end' }}
			/>
		</form>
		<div className="tos-disclaimer">
			<p>
					By signing up you agree to our <Link className="hoverable" target="_blank" to="/terms-of-service">Terms of Service.</Link>
			</p>
		</div>
	</div>
);

export default SignupFields;
