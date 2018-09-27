import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ProfileAvatar from 'components/ProfileAvatar';
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
@translate()
class SettingsMenu extends PureComponent {
	singOut = () => {
		browserHistory.push('/login');
		this.props.logout();
	}

	goToSettings = () => {
		browserHistory.push('/settings');
	}

	goToLeaderboards = () => {
		browserHistory.push('/leaderboards');
	}

	goToLessonFactory = () => {
		browserHistory.push('/lesson-factory');
	}

	goToQuizFactory = () => {
		browserHistory.push('/quiz-factory');
	}

	render() {
		const {
			t,
			userID,
			avatarUrl,
			userName,
		} = this.props;
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
						primaryText={t('leaderboard.title')}
						onClick={this.goToLeaderboards}
					/>
					<MenuItem
						primaryText={t('lesson-factory.title')}
						onClick={this.goToLessonFactory}
					/>
					<MenuItem
						primaryText={t('factory.title')}
						onClick={this.goToQuizFactory}
					/>
					<MenuItem
						primaryText={t('settings.title')}
						onClick={this.goToSettings}
					/>
					<MenuItem
						primaryText={t('settings.signout-action-title')}
						onClick={this.singOut}
					/>
				</IconMenu>
			</div>
		);
	}
}

export default SettingsMenu;
