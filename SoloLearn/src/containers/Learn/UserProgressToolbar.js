import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Progressbar from 'components/Progressbar';
import ProfileAvatar from 'components/ProfileAvatar';
import LeaderboardString from 'components/LeaderboardString';

import 'styles/Learn/UserProgressToolbar.scss';

const UserProgressToolbar = ({
	t,
	profile,
	levels,
}) => {
	const { maxXp } = levels[profile.level - 1];
	const xpRemaining = maxXp - profile.xp;
	const percentageRemaining = xpRemaining / maxXp * 100;
	return (
		<div className="user-progress-toolbar">
			<div className="main-user-info">
				<ProfileAvatar
					size={80}
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
					<p className="user-level">{t('common.user-level')} {profile.level}</p>
				</div>
			</div>
			<LeaderboardString />
			<div className="user-level-info">
				<p style={{ textAlign: 'right' }}>{ profile.xp } XP</p>
				<div className="level-graph-container">
					<div style={{ paddingTop: '100%' }} />
					<div className="level-graph-text">
						{t('common.user-level')} <span>{profile.level}</span>
					</div>
					<Progressbar
						strokeWidth={15}
						style={{ width: '100%' }}
						percentage={100 - percentageRemaining}
					/>
				</div>
				<div className="xp-remaining">
					<p>{ levels[profile.level - 1].maxXp - profile.xp } XP</p>
					<p>{t('play.result.reach-to-level')} { levels[profile.level].number }</p>
				</div>
			</div>
			<div className="user-activity-info">
				<Link to={`/profile/${profile.id}/codes`} className="user-activity-tab">
					<p className="activity-number">{profile.codes}</p>
					<p className="activity-text">{t('profile.tab.codes')}</p>
				</Link>
				<Link to={`/profile/${profile.id}/discussion`} className="user-activity-tab">
					<p className="activity-number">{profile.posts}</p>
					<p className="activity-text">{t('profile.tab.posts')}</p>
				</Link>
				<Link to={`/profile/${profile.id}/skills`} className="user-activity-tab">
					<p className="activity-number">{profile.skills ? profile.skills.length : 0}</p>
					<p className="activity-text">{t('profile.tab.skills')}</p>
				</Link>
			</div>
		</div>
	);
};

const mapStateToProps = ({ userProfile, levels }) => ({ profile: userProfile, levels });

export default connect(mapStateToProps)(translate()((UserProgressToolbar)));
