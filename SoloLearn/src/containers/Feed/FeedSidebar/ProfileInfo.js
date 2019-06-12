import React from 'react';
import { translate } from 'react-i18next';
import { PaperContainer, FlexBox } from 'components/atoms';
import { UsernameLink } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';
import SectionStats from './SectionStats';
import LevelProgress from './LevelProgress';

const ProfileInfo = ({ t, profile, levels }) => (
	<PaperContainer className="profile-info">
		<FlexBox align column fullWidth className="avatar">
			<ProfileAvatar
				size={72}
				userID={profile.id}
				level={profile.level}
				badge={profile.badge}
				userName={profile.name}
				avatarUrl={profile.avatarUrl}
			/>
			<UsernameLink className="username" to={`/profile/${profile.id}`}>
				{profile.name}
			</UsernameLink>
			<LevelProgress profile={profile} levels={levels} />
			<FlexBox fullWidth justifyBetween>
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
