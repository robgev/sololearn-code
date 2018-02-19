import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// i18n
import { translate } from 'react-i18next';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import EditIcon from 'material-ui/svg-icons/image/edit';

const mapStateToProps = ({ userProfile }) => ({
	userProfile,
});

@connect(mapStateToProps)
class Profile extends PureComponent {
	constructor(props) {
		super(props);
		const { name = '', email } = props.userProfile;
		this.state = {
			oldPass: '',
			newPass: '',
			retypePass: '',
			name: name || '',
			email: email || '',
		};
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	render() {
		const {
			name,
			email,
			oldPass,
			newPass,
			retypePass,
		} = this.state;
		return (
			<div className="profile-settings-container">
				<div className="image-group">
					<div className="profile-image-container">
						<Avatar
							size={300}
							alt="My Pic"
							className="profile-image"
							src="https://www.gorillacircuits.com/wp-content/uploads/2016/01/avatar_placeholder.png"
							// src={userProfile.avatarUrl}
						/>
						<Avatar
							icon={<EditIcon />}
							className="profile-edit-button"
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
						name="oldPass"
						value={oldPass}
						style={{ width: '100%' }}
						floatingLabelText="Old Password"
						onChange={this.handleChange}
					/>
					<TextField
						type="password"
						name="newPass"
						value={newPass}
						style={{ width: '100%' }}
						floatingLabelText={t('chnage_password.new-password-placeholder')}
						onChange={this.handleChange}
					/>
					<TextField
						type="password"
						name="retypePass"
						value={retypePass}
						style={{ width: '100%' }}
						floatingLabelText={t('chnage_password.confirm-password-placeholder')}
						onChange={this.handleChange}
					/>
				</div>
			</div>
		);
	}
}

export default translate()(Profile);
