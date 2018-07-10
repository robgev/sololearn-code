import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import omit from 'lodash/omit';

import { updateProfile } from 'actions/settings';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import CropPopup from './CropPopup';

const mapStateToProps = ({ userProfile }) => ({
	userProfile,
});

@connect(mapStateToProps, { updateProfile })
@translate()
class Profile extends PureComponent {
	constructor(props) {
		super(props);
		const { name = '', email, avatarUrl } = props.userProfile;
		this.state = {
			open: false,
			errorText: '',
			retypePass: '',
			oldPassword: '',
			newPassword: '',
			name: name || '',
			email: email || '',
			image: avatarUrl,
		};
	}

	componentWillMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Edit Profile Page' });
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
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

	submitSettings = () => {
		const {
			name,
			email,
			retypePass,
			countryCode,
			oldPassword,
			newPassword,
		} = this.state;
		if (retypePass === newPassword) {
			this.props.updateProfile({
				name,
				email,
				oldPassword,
				countryCode,
				newPassword,
			});
		} else {
			this.setState({ errorText: 'Values should match' });
		}
	}

	render() {
		const {
			open,
			name,
			email,
			image,
			errorText,
			retypePass,
			oldPassword,
			newPassword,
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
					<CropPopup
						t={t}
						open={open}
						image={image}
						onRequestClose={this.handlePopupClose}
					/>
				</div>
				<div className="settings-button">
					<FlatButton
						primary
						onClick={this.submitSettings}
						label={t('common.save-action-title')}
					/>
				</div>
			</div>
		);
	}
}

export default Profile;
