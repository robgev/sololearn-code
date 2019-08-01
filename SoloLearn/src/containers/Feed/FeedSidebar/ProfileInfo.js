import React from 'react';
import { translate } from 'react-i18next';
import { PaperContainer, FlexBox, Container, Link } from 'components/atoms';
import { UsernameLink, ProfileAvatar, ModBadge } from 'components/molecules';
import SectionStats from './SectionStats';
import LevelProgress from './LevelProgress';
import './sidebar.scss';

const ProfileInfo = ({ t, profile, levels }) => (
	<PaperContainer className="profile-info">
		<FlexBox align column fullWidth className="avatar">
			<Container className="edit-profile"><Link to="/settings">{t('common.edit-action-title')}</Link></Container>
			<Container className="profile-info_avatar">
				<ProfileAvatar
					size="normal"
					user={profile}
				/>
				<ModBadge
					className="profile-info_badge"
					badge={profile.badge}
				/>
			</Container>

			<UsernameLink className="username" to={`/profile/${profile.id}`}>
				{profile.name}
			</UsernameLink>
			<LevelProgress profile={profile} levels={levels} />
			<FlexBox fullWidth justifyBetween className="activity_stats">
				<SectionStats
					name={t('profile.tab.codes')}
					stat={profile.codes}
				/>
				<SectionStats
					name={t('profile.tab.posts')}
					stat={profile.posts}
				/>
				<SectionStats
					name={t('profile.tab.skills')}
					stat={profile.skills.length}
				/>
				<SectionStats
					name={t('followers.tab.followers-title')}
					stat={profile.followers}
				/>
			</FlexBox>
		</FlexBox>
	</PaperContainer>
);

export default translate()(ProfileInfo);
