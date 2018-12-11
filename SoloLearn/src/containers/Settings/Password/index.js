import React, { PureComponent } from 'react';
// import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { hash } from 'utils';

import { updateProfile } from 'actions/settings';

import {
	Container,
	Input,
	Snackbar
} from 'components/atoms';
import { FlatButton } from 'components/molecules';

@connect(null, { updateProfile })
@translate()
class Password extends PureComponent {
	state = {
		errorText: '',
		retypePass: '',
		oldPassword: '',
		newPassword: '',
		focusedName: '',
		isSaving: false,
		oldPassErrorText: '',
		snackbarOpen: false,
	}

	// componentWillMount() {
	// 	ReactGA.ga('send', 'screenView', { screenName: 'Edit Profile Page' });
	// }

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value, errorText: '' });
	}

	submitSettings = async () => {
		const { t } = this.props;
		const {
			retypePass,
			oldPassword,
			newPassword,
		} = this.state;
		if (retypePass === newPassword && newPassword !== oldPassword) {
			this.setState({
				errorText: '',
				isSaving: true,
				snackbarOpen: true,
				oldPassErrorText: '',
			});
			await this.props.updateProfile({
				oldPassword: hash(oldPassword),
				newPassword: hash(newPassword),
			});
			this.setState({ isSaving: false });
		} else if (newPassword === oldPassword) {
			// TODO: Change string when got localization
			// Should be "Passwords should not match"
			this.setState({ errorText: '', oldPassErrorText: 'Passwords should not match' });
		} else if (newPassword.length < 6 ) {
			this.setState({ errorText: t('auth.invalid-password'), oldPassErrorText: '' });
		} else {
			this.setState({ errorText: t('register.passwords-not-match'), oldPassErrorText: '' });
		}
	}

	handleSnackBarClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ snackbarOpen: false });
		}
	}

	handleFocus = (e) => {
		const { name } = e.target;
		setTimeout(() => this.setState({ focusedName: name }), 0); // Done for material-ui transition
	}

	render() {
		const {
			isSaving,
			errorText,
			retypePass,
			oldPassword,
			newPassword,
			snackbarOpen,
			focusedName,
			oldPassErrorText,
		} = this.state;
		const { t } = this.props;
		return (
			<Container className="profile-settings-container">
				<Container className="settings-group">
					<Input
						type="password"
						name="oldPassword"
						value={oldPassword}
						className='password_input'
						onChange={this.handleChange}
						label={t('auth.password-placeholder')}
					/>
					<Input
						type="password"
						name="newPassword"
						value={newPassword}
						helperText={oldPassErrorText}
						FormHelperTextProps={{error:true}}
						onChange={this.handleChange}
						className='password_input'
						label={t('chnage_password.new-password-placeholder')}
					/>
					<Input
						id="retypePass"
						type="password"
						name="retypePass"
						value={retypePass}
						helperText={errorText}
						FormHelperTextProps={{error:true}}
						onChange={this.handleChange}
						className='password_input'
						label={t('chnage_password.confirm-password-placeholder')}
					/>
				</Container>
				<Container className="password_button">
					<FlatButton
						onClick={this.submitSettings}
						disabled={!(oldPassword.trim() && newPassword.trim() && retypePass.trim())}
					>
						{t('common.save-action-title')}
					</FlatButton>
				</Container>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={isSaving ? 5000 : 1000}
					onClose={this.handleSnackBarClose}
					message={isSaving ? 'Saving New Settings' : t('code_playground.alert.saved-title')}
				/>
			</Container>
		);
	}
}

export default Password;
