import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updateProfile } from 'actions/settings';

import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import ProfileAvatar from 'components/ProfileAvatar';

import CropPopup from './CropPopup';
import CountrySelector from './CountrySelector';

const mapStateToProps = ({ userProfile }) => ({
	userProfile,
});

@connect(mapStateToProps, { updateProfile })
@translate()
class Profile extends PureComponent {
	constructor(props) {
		super(props);
		const {
			name = '',
			email,
			avatarUrl,
			countryCode,
		} = props.userProfile;
		this.state = {
			open: false,
			isSaving: false,
			name: name || '',
			email: email || '',
			image: avatarUrl,
			snackbarOpen: false,
			countryCode: countryCode === '' ? 'NST' : countryCode,
		};
	}

	componentWillMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Edit Profile Page' });
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	handleSelectionChange = (_, __, countryCode) => {
		this.setState({ countryCode });
	}

	handleInputOpen = () => {
		this._input.click();
	}

	handleNewImage = (e) => {
		const image = URL.createObjectURL(e.target.files[0]);
		this.setState({
			image,
			open: true,
		});
	}

	handlePopupClose = (blob) => {
		const { avatarUrl } = this.props.userProfile;
		this.setState({
			open: false,
			image: blob ? URL.createObjectURL(blob) : avatarUrl,
		});
	}

	shouldDisable() {
		const {
			name,
			email,
			image,
			countryCode,
		} = this.state;
		const {
			avatarUrl,
			name: oldName,
			email: oldEmail,
			countryCode: oldCountryCode,
		} = this.props.userProfile;
		return (name.trim() === oldName.trim()
							&& email.trim() === oldEmail.trim()
							&& countryCode === oldCountryCode
							&& image === avatarUrl)
							|| email.trim() === ''
							|| name.trim() === '';
	}

	submitSettings = async () => {
		const {
			name,
			email,
			countryCode,
		} = this.state;
		this.setState({ snackbarOpen: true, isSaving: true });
		await this.props.updateProfile({
			name,
			email,
			countryCode: countryCode !== 'NST' ? countryCode : '', // Not set value is NST. This is done to fix the cosmetic bug with material-ui
		});
		this.setState({ isSaving: false });
	}

	handleSnackBarClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ snackbarOpen: false });
		}
	}

	render() {
		const {
			open,
			name,
			email,
			image,
			isSaving,
			countryCode,
			snackbarOpen,
		} = this.state;
		const { t, userProfile } = this.props;
		return (
			<div className="profile-settings-container">
				<div className="image-group">
					<div className="profile-image-container">
						<ProfileAvatar
							disabled
							size={200}
							avatarUrl={image}
							userID={userProfile.id}
							userName={userProfile.name}
						/>
						<Avatar
							icon={<EditIcon />}
							onClick={this.handleInputOpen}
							className="profile-edit-button"
						/>
						<input
							type="file"
							name="image"
							className="image-field"
							onChange={this.handleNewImage}
							ref={(input) => { this._input = input; }}
						/>
					</div>
				</div>
				<div className="settings-group">
					<TextField
						name="name"
						value={name}
						style={{ width: '100%' }}
						onChange={this.handleChange}
						floatingLabelText={t('edit_account.user-name')}
					/>
					<TextField
						name="email"
						value={email}
						style={{ width: '100%' }}
						floatingLabelText={t('common.email-title')}
						onChange={this.handleChange}
					/>
				</div>
				<CountrySelector
					t={t}
					value={countryCode}
					onChange={this.handleSelectionChange}
				/>
				<CropPopup
					t={t}
					open={open}
					image={image}
					onRequestClose={this.handlePopupClose}
				/>
				<div className="settings-button">
					<FlatButton
						primary
						onClick={this.submitSettings}
						disabled={this.shouldDisable()}
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

export default Profile;
