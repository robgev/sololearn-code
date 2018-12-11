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
	@observable isSnackbarOpen = false;

	@action toggleReportPopup = () => {
		this.isReportPopupOpen = !this.isReportPopupOpen;
	}

	@action toggleBlockPopup = () => {
		this.isBlockPopupOpen = !this.isBlockPopupOpen;
	}

	@action toggleSnackbar = () => {
		this.isSnackbarOpen = !this.isSnackbarOpen;
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
		this.toggleSnackbar();
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
									onClick={this.toggleReportPopup}
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
						<Link to={`/profile/${profile.id}/skills`}>
							<UserAvatar
								user={profile}
								size="big"
							/>
						</Link>
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
					onClose={this.toggleReportPopup}
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
					autoHideDuration={1500}
					open={this.isSnackbarOpen}
					onClose={this.toggleSnackbar}
					message={t('blocked.user.message')}
				/>
			</Container>
		);
	}
}

export default Header;
