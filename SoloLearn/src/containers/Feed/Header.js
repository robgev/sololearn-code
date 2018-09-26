// React modules
import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

import ProfileAvatar from 'components/ProfileAvatar';
import LeaderboardString from 'components/LeaderboardString';

import 'styles/Feed/Header.scss';

class Header extends PureComponent {
	constructor(props) {
		super(props);
		const { levels, profile } = props;
		const { level: userLevel, xp: currentXp, badge } = profile;
		// Starting from user level we try to find a level
		// That has a status which is not null
		// This means we need to get maxXp of the previous level of that
		// specific status level to get that status
		// That's why we find the index and then set as maxXp
		// the previous level's maxXp
		// If there is no such level, this means the
		// user already has the highest status, so we just
		// show his xp as maxXp, which means no more progress to make
		const nextMilestoneLevelIndex =
			levels.slice(userLevel).findIndex(lvl => lvl.status !== null);
		[ this.currentBadge ] = badge ? badge.split('|') : '';
		if (nextMilestoneLevelIndex !== -1) {
			// Restore index after slice
			this.maxXp = levels[userLevel + nextMilestoneLevelIndex].maxXp;
			this.nextMilestone = levels[userLevel + nextMilestoneLevelIndex].status;
		} else {
			this.maxXp = currentXp;
			[ this.nextMilestone ] = badge ? badge.split('|') : '';
		}
	}

	render() {
		const { profile, t } = this.props;
		const { xp: currentXp } = profile;

		return (
			<Paper className="feed-header">
				<div className="details-wrapper">
					<ProfileAvatar
						size={50}
						badge={profile.badge}
						userID={profile.id}
						userName={profile.name}
						avatarUrl={profile.avatarUrl}
						avatarStyle={{ margin: 0 }}
					/>
					<div className="details">
						<Link to={`/profile/${profile.id}`}>
							<p className="user-name hoverable">{profile.name}</p>
						</Link>
						<LeaderboardString />
						<div className="profile-progress-wrapper">
							<LinearProgress
								min={0}
								color="#8BC34A"
								max={this.maxXp}
								value={currentXp}
								mode="determinate"
								style={{ backgroundColor: '#dedede' }}
							/>
							<div className="user-status-wrapper">
								<span className="user-status">{t(`profile.status-${this.currentBadge}`)}</span>
								<span className="user-status">{t(`profile.status-${this.nextMilestone}`)}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="actions">
					<RaisedButton
						secondary
						label={t('discover_peers.title')}
						containerElement={<Link to="/discover" />}
					/>
				</div>
			</Paper>

		);
	}
}

export default translate()(Header);
