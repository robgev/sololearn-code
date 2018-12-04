// React modules
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import LeaderboardString from 'components/LeaderboardString';
import {
	Container,
	PaperContainer,
} from 'components/atoms';
import {
	RaisedButton,
	UsernameLink,
	ContainerLink,
	ProgressBar,
	ProfileAvatar,
} from 'components/molecules';

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
		const { xp: currentXp, rank } = profile;

		return (
			<PaperContainer className="feed-header">
				<Container className="details-wrapper">
					<ProfileAvatar
						user={profile}
					/>
					<Container className="details">
						<UsernameLink to={`/profile/${profile.id}`}>
							{profile.name}
						</UsernameLink>

						<LeaderboardString ranks={rank} />
						<Container className="profile-progress-wrapper">
							<ProgressBar
								value={100 * currentXp / this.maxXp}
								minText={t(`profile.status-${this.currentBadge}`)}
								maxText={t(`profile.status-${this.nextMilestone}`)}
							/>
						</Container>
					</Container>
				</Container>
				<Container className="actions">
					<ContainerLink to="/discover">
						<RaisedButton>
							{t('discover_peers.title')}
						</RaisedButton>
					</ContainerLink>
				</Container>
			</PaperContainer>

		);
	}
}

export default translate()(Header);
