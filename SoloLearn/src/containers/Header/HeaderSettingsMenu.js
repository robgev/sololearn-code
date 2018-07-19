import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import 'styles/Header/HeaderSettingsMenu.scss';

import { logout } from 'actions/login.action';

const mapStateToProps = ({ userProfile }) => ({
	avatarUrl: userProfile ? userProfile.avatarUrl : null,
	userName: userProfile ? userProfile.name : null,
	userID: userProfile ? userProfile.id : 0,
});

const mapDispatchToProps = {
	logout,
};

@connect(mapStateToProps, mapDispatchToProps)
class SettingsMenu extends PureComponent {
	singOut = () => {
		this.props.logout()
			.then(() => browserHistory.push('/login'));
	}

	goToSettings = () => {
		browserHistory.push('/settings');
	}

	goToLeaderboards = () => {
		browserHistory.push('/leaderboards');
	}

	goToQuizFactory = () => {
		browserHistory.push('/quiz-factory');
	}

	render() {
		const { avatarUrl, userName, userID } = this.props;
		return !(avatarUrl || userName) ? null : (
			<div className="header-settings-menu-container">
				<ProfileAvatar
					userID={userID}
					userName={userName}
					avatarUrl={avatarUrl}
					avatarStyle={{ border: '1px solid white' }}
				/>
				<IconMenu
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
					iconStyle={{ display: 'flex', alignItems: 'center' }}
					iconButtonElement={
						<IconButton style={{ width: 'initial', padding: 0 }}>
							<div>
								<ArrowDown color="white" />
							</div>
						</IconButton>
					}
				>
					<MenuItem
						primaryText="Leaderboards"
						onClick={this.goToLeaderboards}
					/>
					<MenuItem
						primaryText="Lesson Factory"
					/>
					<MenuItem
						primaryText="Quiz Factory"
						onClick={this.goToQuizFactory}
					/>
					<MenuItem
						primaryText="Settings"
						onClick={this.goToSettings}
					/>
					<MenuItem
						primaryText="Sign out"
						onClick={this.singOut}
					/>
				</IconMenu>
			</div>
		);
	}
}

export default SettingsMenu;
