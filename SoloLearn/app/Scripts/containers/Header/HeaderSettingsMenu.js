import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import { logout, imitateLogin } from 'actions/login.action';

const mapStateToProps = ({ userProfile }) => ({ avatarUrl: userProfile ? userProfile.avatarUrl : null });

const mapDispatchToProps = {
	logout,
	imitateLogin,
};

@connect(mapStateToProps, mapDispatchToProps)
class SettingsMenu extends PureComponent {
	singOut = () => {
		this.props.logout()
			.then(() => browserHistory.push('/login'));
	}
	render() {
		const { avatarUrl } = this.props;
		return avatarUrl && (
			<IconMenu
				anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
				targetOrigin={{ horizontal: 'left', vertical: 'top' }}
				iconStyle={{ display: 'flex', alignItems: 'center' }}
				iconButtonElement={
					<IconButton>
						<div>
							<ProfileAvatar
								disabled
								avatarUrl={avatarUrl}
							/>
							<div>
								<ArrowDown color="white" />
							</div>
						</div>
					</IconButton>
				}
			>
				<MenuItem
					primaryText="Sign out"
					onClick={this.singOut}
				/>
				<MenuItem
					primaryText="Imitate logout"
					onClick={this.props.imitateLogin}
				/>
			</IconMenu>
		);
	}
}

export default SettingsMenu;
