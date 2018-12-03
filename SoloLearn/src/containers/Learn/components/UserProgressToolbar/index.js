import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { CircularProgress, Container, TextBlock, SecondaryTextBlock, Title } from 'components/atoms';
import { TextLink, UsernameLink, ProfileAvatar } from 'components/molecules';
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
				<ProfileAvatar
					user={profile}
				/>
				<Container className="details">
					<UsernameLink to={`/profile/${profile.id}`}>
						{profile.name}
					</UsernameLink>
					<SecondaryTextBlock className="block-text">{t('common.user-level')} {profile.level}</SecondaryTextBlock>
				</Container>
			</Container>
			<LeaderboardString />
			<Container className="user-level-info">
				<SecondaryTextBlock className="current-xp">{ profile.xp } XP</SecondaryTextBlock>
				<Container className="level-graph-container">
					<Container className="level-graph-container-padding" />
					<Title className="level-graph-text">
						{t('common.user-level')} {profile.level}
					</Title>
					<CircularProgress
						strokeWidth={10}
						className="user-progress"
						percentage={100 - percentageRemaining}
					/>
				</Container>
				<Container className="xp-remaining">
					<SecondaryTextBlock className="block-text">{ levels[profile.level - 1].maxXp - profile.xp } XP</SecondaryTextBlock>
					<SecondaryTextBlock>{t('play.result.reach-to-level')} { levels[profile.level].number }</SecondaryTextBlock>
				</Container>
			</Container>
			<Container className="user-activity-info">
				<TextLink to={`/profile/${profile.id}/codes`} className="user-activity-tab">
					<TextBlock className="block-text">{profile.codes}</TextBlock>
					<SecondaryTextBlock className="block-text">{t('profile.tab.codes')}</SecondaryTextBlock>
				</TextLink>
				<TextLink to={`/profile/${profile.id}/discussion`} className="user-activity-tab">
					<TextBlock className="block-text">{profile.posts}</TextBlock>
					<SecondaryTextBlock className="block-text">{t('profile.tab.posts')}</SecondaryTextBlock>
				</TextLink>
				<TextLink to={`/profile/${profile.id}/skills`} className="user-activity-tab">
					<TextBlock className="block-text">{profile.skills ? profile.skills.length : 0}</TextBlock>
					<SecondaryTextBlock className="block-text">{t('profile.tab.skills')}</SecondaryTextBlock>
				</TextLink>
			</Container>
		</Container>
	);
};

const mapStateToProps = ({ userProfile, levels }) => ({ profile: userProfile, levels });

export default connect(mapStateToProps)(translate()((UserProgressToolbar)));
