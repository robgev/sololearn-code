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

const styles = {
	container: {
		cursor: 'pointer',
		padding: '10px',
	},

	detailsWrapper: {
		display: 'flex',
		alignItems: 'center',
	},

	details: {
		flex: '2 auto',
		margin: '0 0 0 8px',
	},

	name: {
		fontSize: '14px',
		fontWeight: 500,
		color: '#5d5b5b',
	},

	leaderboardLink: {
		fontSize: '12px',
		fontWeight: 500,
		textDecoration: 'none',
		color: '#607d8b',
		margin: '5px 0',
		display: 'block',
	},

	progressWrapper: {
		textAlign: 'right',
	},

	status: {
		fontSize: '11px',
		color: '#777',
	},

	progress: {
		backgroundColor: '#dedede',
	},

	actions: {
		margin: '10px 0 0 0',
		textAlign: 'right',
	},
};

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
			<Link to={`/profile/${this.props.profile.id}`}>
				<Paper className="feed-header" style={styles.container}>
					<div className="details-wrapper" style={styles.detailsWrapper}>
						<ProfileAvatar
							size={50}
							userID={profile.id}
							style={styles.avatar}
							userName={profile.name}
							avatarUrl={profile.avatarUrl}
						/>
						<div className="details" style={styles.details}>
							<p style={styles.name}>{profile.name}</p>
							<Link to="/leaderboards" style={styles.leaderboardLink}>
								{t('leaderboard.rank.placeholder')}
							</Link>
							<div style={styles.progressWrapper}>
								<LinearProgress
									min={0}
									max={maxXp}
									color="#8BC34A"
									value={currentXp}
									mode="determinate"
									style={styles.progress}
								/>
								<span style={styles.status}>{status}</span>
							</div>
						</div>
					</div>
					<div className="actions" style={styles.actions}>
						<RaisedButton
							secondary
							label={t('discover_peers.invite-friends')}
							containerElement={<Link to="/discover" />}
						/>
					</div>
				</Paper>
			</Link>
		);
	}
}

export default translate()(Header);
