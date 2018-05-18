// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Person from 'material-ui/svg-icons/social/person';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import { followUserInternal, unfollowUserInternal } from 'actions/profile';
import { blockUser } from 'actions/settings';

// Utils and defaults
import { numberFormatter, determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';

import ProfileAvatar from 'components/Shared/ProfileAvatar';
import ReportPopup from 'components/Shared/ReportPopup';

// i18next
import { translate } from 'react-i18next';

import DeactivationPopup from './DeactivationPopup';
import BlockPopup from './BlockPopup';

const styles = {
	detailsWrapper: {
		position: 'relative',
	},

	details: {
		width: '50%',
		margin: '0 auto 10px',
		textAlign: 'center',
	},

	userNameWrapper: {
		position: 'relative',
	},

	userName: {
		fontSize: '17px',
		fontWeight: 500,
		margin: '7px 0 3px 0',
	},

	level: {
		fontSize: '13px',
		margin: '0 0 3px 0',
	},

	userStats: {
		position: 'relative',
	},

	xp: {
		base: {
			position: 'absolute',
			top: 0,
			fontSize: '10px',
			fontWeight: 500,
			color: '#fff',
		},

		left: {
			left: '2px',
		},

		right: {
			right: '2px',
		},
	},

	progress: {
		height: '13px',
		backgroundColor: '#dedede',
	},

	followersButton: {
		base: {
			position: 'absolute',
			minWidth: '50px',
			margin: '0 0 0 5px',
		},

		button: {
			height: '30px',
			lineHeight: '30px',
		},

		overlay: {
			height: '30px',
		},
	},

	followersIcon: {
		height: '20px',
		width: '20px',
		margin: '0 0 0 10px',
	},

	actionButton: {
		base: {
			position: 'absolute',
			right: '10px',
			height: '25px',
		},

		label: {
			fontSize: '12px',
		},

		button: {
			height: '25px',
			lineHeight: '25px',
		},

		overlay: {
			height: '25px',
		},
	},
};

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	blockUser,
	followUser: followUserInternal,
	unfollowUser: unfollowUserInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reportPopupOpen: false,
			blockPopupOpened: false,
			deactivationPopupOpen: false,
			isFollowing: this.props.profile.isFollowing,
		};

		this.handleFollowing = this.handleFollowing.bind(this);
	}

	handleFollowing(id, follow, fromFollowers) {
		this.setState({ isFollowing: follow });

		if (follow) {
			this.props.followUser(id, fromFollowers);
		} else {
			this.props.unfollowUser(id, fromFollowers);
		}
	}

	blockUser = () => {
		const { profile, blockUser } = this.props;
		blockUser({
			userId: profile.id,
			block: !profile.blockedState,
		});
		this.toggleBlockPopup();
	}

	toggleReportPopup = () => {
		const { reportPopupOpen } = this.state;
		this.setState({ reportPopupOpen: !reportPopupOpen });
	}

	toggleBlockPopup = () => {
		const { blockPopupOpened } = this.state;
		this.setState({ blockPopupOpened: !blockPopupOpened });
	}

	toggleDeactivationPopup = () => {
		const { deactivationPopupOpen } = this.state;
		this.setState({ deactivationPopupOpen: !deactivationPopupOpen });
	}

	render() {
		const {
			reportPopupOpen,
			blockPopupOpened,
			deactivationPopupOpen,
		} = this.state;
		const {
			t, profile, levels, userId, accessLevel,
		} = this.props;

		const nextLevel = levels.filter(item => item.maxXp > profile.xp)[0];

		return (
			<div className="details-wrapper" style={styles.detailsWrapper}>
				{
					profile.id !== userId &&
					<div>
						<RaisedButton
							label={this.state.isFollowing ? t('common.user-following') : t('common.follow-user')}
							primary={!this.state.isFollowing}
							secondary={this.state.isFollowing}
							style={styles.actionButton.base}
							labelStyle={styles.actionButton.label}
							buttonStyle={styles.actionButton.button}
							overlayStyle={styles.actionButton.overlay}
							onClick={() => { this.handleFollowing(profile.id, !this.state.isFollowing, null); }}
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
							{ (accessLevel > 0
									&& !determineAccessLevel(profile.accessLevel) > 0) &&
									<MenuItem
										primaryText={t('common.deactivate-action-title')}
										onClick={this.toggleDeactivationPopup}
									/>
							}
						</IconMenu>
					</div>
				}
				<div className="details" style={styles.details}>
					<ProfileAvatar
						size={100}
						withBorder
						userID={profile.id}
						style={styles.avatar}
						badge={profile.badge}
						userName={profile.name}
						avatarUrl={profile.avatarUrl}
					/>
					<div style={styles.userNameWrapper}>
						<span style={styles.userName}>{profile.name}</span>
						<RaisedButton
							label={numberFormatter(profile.followers)}
							secondary
							icon={<Person style={styles.followersIcon} />}
							style={styles.followersButton.base}
							buttonStyle={styles.followersButton.button}
							overlayStyle={styles.followersButton.overlay}
							onClick={this.props.openPopup}
						/>
					</div>
					<p style={styles.level}>{t('common.user-level')} {profile.level}</p>
					<div className="progress-wrapper" style={styles.userStats}>
						<LinearProgress
							style={styles.progress}
							mode="determinate"
							min={0}
							max={nextLevel.maxXp}
							value={profile.xp}
							color="#8BC34A"
						/>
						<span style={{ ...styles.xp.base, ...styles.xp.left }}>{profile.xp} XP</span>
						<span style={{ ...styles.xp.base, ...styles.xp.right }}>{nextLevel.maxXp} XP</span>
					</div>
				</div>
				<ReportPopup
					itemId={profile.id}
					open={reportPopupOpen}
					itemType={ReportItemTypes.profile}
					onRequestClose={this.toggleReportPopup}
				/>
				<BlockPopup
					userId={profile.id}
					open={blockPopupOpened}
					blockUser={this.blockUser}
					onRequestClose={this.toggleBlockPopup}
				/>
				<DeactivationPopup
					reportedUserId={profile.id}
					open={deactivationPopupOpen}
					itemType={ReportItemTypes.profile}
					onRequestClose={this.toggleDeactivationPopup}
					accessLevel={accessLevel}
				/>
			</div>
		);
	}
}

export default Header;
