// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

// Material UI components
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Person from 'material-ui/svg-icons/social/person';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import { blockUser } from 'actions/settings';

// Utils and defaults
import { numberFormatter, determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';

import ProfileAvatar from 'components/ProfileAvatar';
import ReportPopup from 'components/ReportPopup';

// i18next
import { translate } from 'react-i18next';

import DeactivationPopup from './DeactivationPopup';
import BlockPopup from './BlockPopup';

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
	@observable isReportPopupOpen = false;
	@observable isBlockPopupOpen = false;
	@observable isDeactivationPopupOpen = false;

	@action toggleReportPopup = () => {
		this.isReportPopupOpen = !this.isReportPopupOpen;
	}

	@action toggleBlockPopup = () => {
		this.isBlockPopupOpen = !this.isBlockPopupOpen;
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
			<div className="profile-header-container">
				<div className="header-top-buttons">
					<RaisedButton
						secondary
						icon={<Person />}
						style={{ marginRight: 3 }}
						onClick={openFollowerPopup}
						label={numberFormatter(profile.followers)}
					/>
					{
						profile.id !== userId &&
						<div className="action-buttons">
							<RaisedButton
								secondary={profile.isFollowing}
								onClick={onFollow}
								label={profile.isFollowing ? t('common.user-following') : t('common.follow-user')}
							/>
							<IconMenu
								iconButtonElement={
									<IconButton><MoreVertIcon /></IconButton>
								}
								anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
								targetOrigin={{ horizontal: 'right', vertical: 'top' }}
							>
								<MenuItem
									primaryText={t('common.report-action-title')}
									onClick={this.toggleReportPopup}
								/>
								<MenuItem
									primaryText={t('common.block-user')}
									onClick={this.toggleBlockPopup}
								/>
								{(accessLevel > 0
									&& !determineAccessLevel(profile.accessLevel) > 0) &&
									<MenuItem
										primaryText={t('common.deactivate-action-title')}
										onClick={this.toggleDeactivationPopup}
									/>
								}
							</IconMenu>
						</div>
					}
				</div>
				<div className="profile-header-details">
					<ProfileAvatar
						disabled
						size={130}
						withBorder
						userID={profile.id}
						badge={profile.badge}
						userName={profile.name}
						avatarUrl={profile.avatarUrl}
					/>
					<span className="user-name">{profile.name}</span>
					<p className="user-level">{t('common.user-level')} {profile.level}</p>
					<div className="profile-progress-wrapper">
						<LinearProgress
							min={0}
							max={maxXp}
							color="#8BC34A"
							value={profile.xp}
							mode="determinate"
							style={{ height: 13, backgroundColor: '#DEDEDE' }}
						/>
						<span className="xp-number left">{profile.xp} XP</span>
						<span className="xp-number right">{maxXp} XP</span>
					</div>
				</div>
				<ReportPopup
					itemId={profile.id}
					open={this.isReportPopupOpen}
					itemType={ReportItemTypes.profile}
					onRequestClose={this.toggleReportPopup}
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
			</div>
		);
	}
}

export default Header;
