import React, { PureComponent } from 'react';
// import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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
		isSaving: false,
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
		if (retypePass === newPassword) {
			this.setState({ snackbarOpen: true, isSaving: true });
			await this.props.updateProfile({
				oldPassword,
				newPassword,
			});
			this.setState({ isSaving: false });
		} else {
			this.setState({ errorText: t('register.passwords-not-match') });
		}
	}

	handleSnackBarClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ snackbarOpen: false });
		}
	}

	render() {
		const {
			isSaving,
			errorText,
			retypePass,
			oldPassword,
			newPassword,
			snackbarOpen,
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
						floatingLabelText="Old Password"
						onChange={this.handleChange}
					/>
					<TextField
						type="password"
						name="newPassword"
						value={newPassword}
						errorText={errorText}
						style={{ width: '100%', textTransform: 'capitalize' }}
						floatingLabelText={t('chnage_password.new-password-placeholder')}
						onChange={this.handleChange}
					/>
					<TextField
						type="password"
						name="retypePass"
						value={retypePass}
						errorText={errorText}
						style={{ width: '100%', textTransform: 'capitalize' }}
						floatingLabelText={t('chnage_password.confirm-password-placeholder')}
						onChange={this.handleChange}
					/>
				</div>
				<div className="settings-button">
					<FlatButton
						primary
						onClick={this.submitSettings}
						label={t('common.save-action-title')}
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
