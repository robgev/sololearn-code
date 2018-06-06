// React modules
import React, { PureComponent } from 'react';
import { Link, browserHistory } from 'react-router';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

// Material UI components
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

// i18next
import { translate } from 'react-i18next';

import 'styles/Feed/Header.scss';

class Header extends PureComponent {
	render() {
		const { levels, profile, t } = this.props;
		const { level: userLevel, xp: currentXp } = profile;
		let maxXp = null;
		let status = '';
		const levelsWithStatus = levels.filter(item => item.status != null);
		// TODO Write a comment
		if (userLevel >= levelsWithStatus[levelsWithStatus.length - 1].number) {
			maxXp = currentXp;
			status = levelsWithStatus[levelsWithStatus.length - 1].status;
		} else {
			for (let i = userLevel; i < levels.length - 1; i++) {
				const currentLevel = levels[i];

				if (currentLevel.status != null) {
					maxXp = levels[i - 1].maxXp;
					status = currentLevel.status;
					break;
				}
			}
		}

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
						<Link to={`/profile/${this.props.profile.id}`}>
							<p className="user-name hoverable">{profile.name}</p>
						</Link>
						<Link to="/leaderboards" className="leaderboard-link hoverable">
							{t('leaderboard.rank.placeholder')}
						</Link>
						<div className="progress-wrapper">
							<LinearProgress
								min={0}
								max={maxXp}
								color="#8BC34A"
								value={currentXp}
								mode="determinate"
								style={{ backgroundColor: '#dedede' }}
							/>
							<span className="user-status">{status}</span>
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
