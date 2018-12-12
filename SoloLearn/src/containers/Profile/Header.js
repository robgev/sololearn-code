// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observable, action, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { blockUser } from 'actions/settings';
import { numberFormatter, determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/ReportPopup';
import { Person } from 'components/icons';
import {
	Container,
	MenuItem,
	SecondaryTextBlock,
	Snackbar,
	Link,
} from 'components/atoms';
import {
	RaisedButton,
	IconMenu,
	UsernameLink,
	ProgressBar,
	ContainerLink,
} from 'components/molecules';

import DeactivationPopup from './DeactivationPopup';
import BlockPopup from './BlockPopup';
import { UserAvatar } from './components';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	blockUser,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
@observer
class Header extends Component {
	componentDidMount() {
		this.dispose = autorun(() => {
			if (this.props.profile.name) {
				document.title = this.props.profile.name;
			}
		});
	}
	componentWillUnmount() {
		this.dispose();
	}
	@observable isReportPopupOpen = false;
	@observable isBlockPopupOpen = false;
	@observable isDeactivationPopupOpen = false;
	@observable isBlockSnackbarOpen = false;
	@observable isReportSnackbarOpen = false;

	@action openReportPopup = () => {
		this.isReportPopupOpen = true;

	}
	@action closeReportPopup = (isReported) => {
		this.isReportPopupOpen = false;
		if (isReported) {
			this.openReportSnackbar();
		}
	}

	@action openReportSnackbar = () => {
		this.isReportSnackbarOpen = true;
	}

	@action closeReportSnackbar = () => {
		this.isReportSnackbarOpen = false;
	}

	@action toggleBlockPopup = () => {
		this.isBlockPopupOpen = !this.isBlockPopupOpen;
	}

	@action toggleBlockSnackbar = () => {
		this.isBlockSnackbarOpen = !this.isBlockSnackbarOpen;
	}

	@action toggleDeactivationPopup = () => {
		this.isDeactivationPopupOpen = !this.isDeactivationPopupOpen;
	}

	blockUser = () => {
		const { profile } = this.props;
		this.props.blockUser({
			userId: profile.id,
			block: !profile.blockedState,
		});
		this.toggleBlockPopup();
		this.toggleBlockSnackbar();
	}

	render() {
		const {
			t,
			levels,
			userId,
			profile,
			openFollowerPopup,
			accessLevel,
			onFollow,
		} = this.props;

		const nextLevel = levels.filter(item => item.maxXp > profile.xp)[0];
		const maxXp = nextLevel ? nextLevel.maxXp : 0;
		return (
			<Container className="profile-header-container">
				<Container className="header-top-buttons">
					<RaisedButton
						color="secondary"
						onClick={openFollowerPopup}
					>
						<Person />
						{numberFormatter(profile.followers)}
					</RaisedButton>
					{
						profile.id !== userId &&
						<Container className="action-buttons">
							<RaisedButton
								onClick={onFollow}
								className="follow-button"
								color={profile.isFollowing ? 'secondary' : 'default'}
							>
								{profile.isFollowing ? t('common.user-following') : t('common.follow-user')}
							</RaisedButton>
							<IconMenu>
								<MenuItem
									onClick={this.openReportPopup}
								>
									{t('common.report-action-title')}
								</MenuItem>
								<MenuItem
									onClick={this.toggleBlockPopup}
								>
									{t('common.block-user')}
								</MenuItem>
								{(accessLevel > 0
									&& !determineAccessLevel(profile.accessLevel) > 0) &&
									<MenuItem
										onClick={this.toggleDeactivationPopup}
									>
										{t('common.deactivate-action-title')}
									</MenuItem>
								}
							</IconMenu>
						</Container>
					}
				</Container>
				<Container className="profile-header-details">
					{ profile.id &&
						
						<UserAvatar
							user={profile}
							size="big"
							link={`/profile/${profile.id}/skills`}
						/>
					
					}
					<UsernameLink to={`/profile/${profile.id}`} className="user-name">{profile.name}</UsernameLink>
					<SecondaryTextBlock className="user-level">{t('common.user-level')} {profile.level}</SecondaryTextBlock>
					<Container className="profile-progress-wrapper">
						<ProgressBar
							value={(100 * profile.xp) / maxXp}
							minText={`${profile.xp} XP`}
							maxText={`${maxXp} XP`}
						/>
					</Container>
				</Container>
				<ReportPopup
					itemId={profile.id}
					open={this.isReportPopupOpen}
					itemType={ReportItemTypes.profile}
					onClose={this.closeReportPopup}
				/>
				<BlockPopup
					userId={profile.id}
					open={this.isBlockPopupOpen}
					blockUser={this.blockUser}
					onRequestClose={this.toggleBlockPopup}
				/>
				<DeactivationPopup
					reportedUserId={profile.id}
					open={this.isDeactivationPopupOpen}
					itemType={ReportItemTypes.profile}
					onRequestClose={this.toggleDeactivationPopup}
					accessLevel={accessLevel}
				/>
				<Snackbar
					open={this.isBlockSnackbarOpen}
					onClose={this.toggleBlockSnackbar}
					message={t('blocked.user.message')}
				/>
				<Snackbar
					onClose={this.closeReportSnackbar}
					open={this.isReportSnackbarOpen}
					message={t('report.report-submitted-title')}
				/>
			</Container>
		);
	}
}

export default Header;
