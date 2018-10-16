import React, { PureComponent } from 'react';
// import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { hash } from 'utils';

import { updateProfile } from 'actions/settings';

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

// const mapStateToProps = ({ userProfile }) => ({
// 	userProfile,
// });

// @connect(mapStateToProps, { updateProfile })
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
		this.setState({ [name]: value });
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
			this.setState({ errorText: '', oldPassErrorText: t('register.passwords-not-match') });
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
			<div className="profile-settings-container">
				<div className="settings-group">
					<TextField
						type="password"
						name="oldPassword"
						value={oldPassword}
						style={{ width: '100%' }}
						onFocus={this.handleFocus}
						onChange={this.handleChange}
						readOnly={focusedName !== 'oldPassword'}
						floatingLabelText={t('auth.password-placeholder')}
					/>
					<TextField
						type="password"
						name="newPassword"
						value={newPassword}
						onFocus={this.handleFocus}
						errorText={oldPassErrorText}
						onChange={this.handleChange}
						readOnly={focusedName !== 'newPassword'}
						style={{ width: '100%', textTransform: 'capitalize' }}
						floatingLabelText={t('chnage_password.new-password-placeholder')}
					/>
					<TextField
						id="retypePass"
						type="password"
						name="retypePass"
						value={retypePass}
						errorText={errorText}
						onFocus={this.handleFocus}
						onChange={this.handleChange}
						readOnly={focusedName !== 'retypePass'}
						style={{ width: '100%', textTransform: 'capitalize' }}
						floatingLabelText={t('chnage_password.confirm-password-placeholder')}
					/>
				</div>
				<div className="settings-button">
					<FlatButton
						primary
						onClick={this.submitSettings}
						label={t('common.save-action-title')}
						disabled={!(oldPassword.trim() && newPassword.trim() && retypePass.trim())}
					/>
				</div>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={isSaving ? 5000 : 1000}
					onRequestClose={this.handleSnackBarClose}
					message={isSaving ? 'Saving New Settings' : t('code_playground.alert.saved-title')}
				/>
			</div>
		);
	}
}

export default Password;
