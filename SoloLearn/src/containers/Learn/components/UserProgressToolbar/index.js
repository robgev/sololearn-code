import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { CircularProgress, Container } from 'components/atoms';
import { TextLink, Avatar, UsernameLink } from 'components/molecules';
import LeaderboardString from 'components/LeaderboardString';

import './styles.scss';

const UserProgressToolbar = ({
	t,
	profile,
	levels,
}) => {
	const { maxXp } = levels[profile.level - 1];
	const xpRemaining = maxXp - profile.xp;
	const percentageRemaining = xpRemaining / maxXp * 100;
	return (
		<Container className="user-progress-toolbar">
			<Container className="main-user-info">
				<Avatar
					badge={profile.badge}
					userID={profile.id}
					userName={profile.name}
					avatarUrl={profile.avatarUrl}
					avatarStyle={{ margin: 0 }}
				/>
				<Container className="details">
					<UsernameLink to={`/profile/${profile.id}`}>
						{profile.name}
					</UsernameLink>
					<p className="user-level">{t('common.user-level')} {profile.level}</p>
				</Container>
			</Container>
			<LeaderboardString />
			<Container className="user-level-info">
				<p style={{ textAlign: 'right' }}>{ profile.xp } XP</p>
				<Container className="level-graph-container">
					<Container style={{ paddingTop: '100%' }} />
					<Container className="level-graph-text">
						{t('common.user-level')} <span>{profile.level}</span>
					</Container>
					<CircularProgress
						strokeWidth={15}
						style={{ width: '100%' }}
						percentage={100 - percentageRemaining}
					/>
				</Container>
				<Container className="xp-remaining">
					<p>{ levels[profile.level - 1].maxXp - profile.xp } XP</p>
					<p>{t('play.result.reach-to-level')} { levels[profile.level].number }</p>
				</Container>
			</Container>
			<Container className="user-activity-info">
				<TextLink to={`/profile/${profile.id}/codes`} className="user-activity-tab">
					<p className="activity-number">{profile.codes}</p>
					<p className="activity-text">{t('profile.tab.codes')}</p>
				</TextLink>
				<TextLink to={`/profile/${profile.id}/discussion`} className="user-activity-tab">
					<p className="activity-number">{profile.posts}</p>
					<p className="activity-text">{t('profile.tab.posts')}</p>
				</TextLink>
				<TextLink to={`/profile/${profile.id}/skills`} className="user-activity-tab">
					<p className="activity-number">{profile.skills ? profile.skills.length : 0}</p>
					<p className="activity-text">{t('profile.tab.skills')}</p>
				</TextLink>
			</Container>
		</Container>
	);
};

const mapStateToProps = ({ userProfile, levels }) => ({ profile: userProfile, levels });

export default connect(mapStateToProps)(translate()((UserProgressToolbar)));
