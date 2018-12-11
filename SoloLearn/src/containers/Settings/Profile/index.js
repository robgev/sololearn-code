import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { updateProfile } from 'actions/settings';

import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { Edit } from 'components/icons';
import ProfileAvatar from 'components/ProfileAvatar';

import {
	Container,
	Input,
} from 'components/atoms';
import {
	FlatButton,
	RoundImage,
	Avatar,
} from 'components/molecules';

import CropPopup from './CropPopup';
import CountrySelector from './CountrySelector';

import countries from 'constants/Countries.json';

// preload images for CountrySelector
const images = countries.map(country => (
	<img
		src={`/assets/flags/${country.code.toLowerCase()}.png`}
	/>
));

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

	handleSelectionChange = (event) => {
		const countryCode = event.target.value;
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

	handlePopupClose = (newUrl) => {
		const { avatarUrl } = this.props.userProfile;
		this.setState({
			open: false,
			image: newUrl || avatarUrl,
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

	submitSettings = async (e) => {
		e.preventDefault();
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

	clearImage = (e) => {
		e.target.value = null;
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
			<Container className="profile-settings-container">
				<Container className="image-group">
					<Container className="profile-image-container">
						<Avatar
							disabled
							variant="big"
							avatarUrl={image}
							userID={userProfile.id}
							userName={userProfile.name}
						/>
						<RoundImage
							onClick={this.handleInputOpen}
							className="profile-edit-button"
						>
							<Edit />
						</RoundImage>

						<input
							type="file"
							name="image"
							className="image-field"
							onClick={this.clearImage}
							onChange={this.handleNewImage}
							ref={(input) => { this._input = input; }}
						/>
					</Container>
				</Container>
				<form onSubmit={this.submitSettings} className="settings-form-container">
					<Container className="settings-group">
						<Input
							name="name"
							value={name}
							className="settings-input"
							onChange={this.handleChange}
							label={t('edit_account.user-name')}
						/>
						<Input
							type="email"
							name="email"
							value={email}
							className="settings-input"
							label={t('common.email-title')}
							onChange={this.handleChange}
						/>
					</Container>
					<CountrySelector
						t={t}
						value={countryCode}
						onChange={this.handleSelectionChange}
					/>
					<Container className="settings-button">
						<FlatButton
							primary
							type="submit"
							disabled={this.shouldDisable()}
						>
							{t('common.save-action-title')}
						</FlatButton>
					</Container>
				</form>
				<CropPopup
					t={t}
					open={open}
					image={image}
					onRequestClose={this.handlePopupClose}
				/>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={isSaving ? 5000 : 1000}
					onClose={this.handleSnackBarClose}
					message={isSaving ? 'Saving New Settings' : t('code_playground.alert.saved-title')}
				/>

				<Container
					style={{ display: 'none' }}
					// preload images for CountrySelector
				>
					{images}
				</Container>
			</Container>
		);
	}
}

export default Profile;
