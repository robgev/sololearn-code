import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import { logout, imitateLogin } from 'actions/login.action';

const mapStateToProps = ({ userProfile }) => ({
	avatarUrl: userProfile ? userProfile.avatarUrl : null,
	userName: userProfile ? userProfile.name : null,
});

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
		const { avatarUrl, userName } = this.props;
		return (avatarUrl || userName) && (
			<IconMenu
				targetOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				iconStyle={{ display: 'flex', alignItems: 'center' }}
				iconButtonElement={
					<IconButton>
						<div>
							<ProfileAvatar
								disabled
								userName={userName}
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
