import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import ProfileAvatar from 'components/ProfileAvatar';
import { MenuItem } from 'components/atoms';
import { IconMenu } from 'components/molecules';
import { ArrowDropDown } from 'components/icons';

import { logout } from 'actions/login.action';

import 'styles/Header/HeaderSettingsMenu.scss';

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
		browserHistory.push('/signin');
		this.props.logout();
	}

	goToSettings = () => {
		browserHistory.push('/settings');
	}

	goToLeaderboards = () => {
		browserHistory.push('/leaderboard');
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
					avatarStyle={{
						width: 36,
						height: 36,
						margin: 0,
						marginLeft: 5,
					}}
				/>
				<IconMenu
					icon={ArrowDropDown}
					iconProps={{ className: 'header-icon-menu' }}
				>
					<MenuItem
						onClick={this.goToLeaderboards}
					>
						{t('leaderboard.title')}
					</MenuItem>
					<MenuItem
						onClick={this.goToLessonFactory}
					>
						{t('lesson-factory.title')}
					</MenuItem>
					<MenuItem
						onClick={this.goToQuizFactory}
					>
						{t('factory.title')}
					</MenuItem>
					<MenuItem
						onClick={this.goToSettings}
					>
						{t('settings.title')}
					</MenuItem>
					<MenuItem
						onClick={this.singOut}
					>
						{t('settings.signout-action-title')}
					</MenuItem>
				</IconMenu>
			</div>
		);
	}
}

export default SettingsMenu;
