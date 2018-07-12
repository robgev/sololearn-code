import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import i18n from 'i18next';

import { updateProfile } from 'actions/settings';
import Service from 'api/service';
import Storage from 'api/storage';

import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import CropPopup from './CropPopup';
import CountrySelector from './CountrySelector';
import LanguageSelector from './LanguageSelector';

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
		const locale = Storage.load('locale') || 'en';
		this.state = {
			locale,
			open: false,
			errorText: '',
			retypePass: '',
			oldPassword: '',
			isSaving: false,
			newPassword: '',
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

	handleLocaleChange = (_, __, locale) => {
		this.setState({ locale });
		Storage.save('locale', locale);
		Service.getSession(locale);
		i18n.changeLanguage(locale, (err) => {
			if (err) { console.log('something went wrong loading', err); }
		});
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

	handlePopupClose = () => {
		this.setState({
			open: false,
		});
	}

	submitSettings = async () => {
		const {
			name,
			email,
			retypePass,
			countryCode,
			oldPassword,
			newPassword,
		} = this.state;
		if (retypePass === newPassword) {
			this.setState({ snackbarOpen: true, isSaving: true });
			await this.props.updateProfile({
				name,
				email,
				oldPassword,
				newPassword,
				countryCode: countryCode !== 'NST' ? countryCode : '', // Not set value is NST. This is done to fix the cosmetic bug with material-ui
			});
			this.setState({ isSaving: false });
		} else {
			this.setState({ errorText: 'Values should match' });
		}
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
			locale,
			isSaving,
			errorText,
			retypePass,
			oldPassword,
			countryCode,
			newPassword,
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
							userID={userProfile.id}
							userName={userProfile.name}
							avatarUrl={userProfile.avatarUrl}
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
						floatingLabelText="Name"
						onChange={this.handleChange}
					/>
					<TextField
						name="email"
						value={email}
						style={{ width: '100%' }}
						floatingLabelText={t('common.email-title')}
						onChange={this.handleChange}
					/>
				</div>
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
				<CountrySelector
					t={t}
					value={countryCode}
					onChange={this.handleSelectionChange}
				/>
				<LanguageSelector
					t={t}
					value={locale}
					onChange={this.handleLocaleChange}
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
