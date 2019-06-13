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
import Feedback from 'containers/Feedback';

const mapStateToProps = ({ userProfile, locale }) => ({
	avatarUrl: userProfile ? userProfile.avatarUrl : null,
	userName: userProfile ? userProfile.name : null,
	userID: userProfile ? userProfile.id : 0,
	locale,
});

const mapDispatchToProps = {
	logout,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class SettingsMenu extends PureComponent {
	state={
		openFeedback: false,
	}

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

	toggleFeedback=() => {
		this.setState(s => ({ openFeedback: !s.openFeedback }));
	}

	render() {
		const {
			t,
			userID,
			avatarUrl,
			userName,
			locale,
		} = this.props;
		const {
			openFeedback,
		} = this.state;
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
					{
						locale === 'en' &&
						<MenuItem
							onClick={this.goToQuizFactory}
						>
							{t('factory.title')}
						</MenuItem>
					}
					<MenuItem
						onClick={this.toggleFeedback}
					>
						{t('feedback.title')}
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

				<Feedback
					openFeedback={openFeedback}
					toggleFeedback={this.toggleFeedback}
				/>
			</div>
		);
	}
}

export default SettingsMenu;
