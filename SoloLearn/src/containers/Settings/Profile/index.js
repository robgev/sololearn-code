import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
	Container,
	Input,
	Snackbar,
	Image,
} from 'components/atoms';
import {
	PromiseButton,
	RoundImage,
	Avatar,
} from 'components/molecules';
import { Edit } from 'components/icons';

import countries from 'constants/Countries.json';

import { updateProfile } from 'actions/settings';

import CropPopup from './CropPopup';
import CountrySelector from './CountrySelector';

// preload images for CountrySelector
const images = countries.map(country => (
	<Image
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
			name: name || '',
			email: email || '',
			image: avatarUrl,
			newImage: null,
			snackbarOpen: false,
			countryCode: countryCode || 'NST',
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
		const newImage = URL.createObjectURL(e.target.files[0]);
		this.setState({
			newImage,
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

	submitSettings = async () => {
		const {
			name,
			email,
			countryCode,
		} = this.state;
		return this.props.updateProfile({
			name,
			email,
			countryCode: countryCode === 'NST' ? '' : countryCode, // Not set value is NST. This is done to fix the cosmetic bug with material-ui
		})
			.then(() => {
				this.setState({ snackbarOpen: true });
			});
	}

	snackbarCloseHandler = (_, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		this.setState({ snackbarOpen: false });
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
			countryCode,
			snackbarOpen,
			newImage,
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
				<Container className="settings-form-container">
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
						<PromiseButton
							fire={this.submitSettings}
							disabled={this.shouldDisable()}
						>
							{t('common.save-action-title')}
						</PromiseButton>
					</Container>
				</Container>
				<CropPopup
					t={t}
					open={open}
					image={newImage}
					onRequestClose={this.handlePopupClose}
				/>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={4000}
					onClose={this.snackbarCloseHandler}
					message={t('code_playground.alert.saved-title')}
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
