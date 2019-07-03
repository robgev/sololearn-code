import React, { useEffect, useState } from 'react';
import Service from 'api/service';
import {
	FlexBox,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	ProfileAvatar,
	ModBadge,
	UsernameLink,
	IconWithText,
} from 'components/molecules';
import { Level } from 'components/icons';

const ProfilePreview = ({ id, to }) => {
	const [profile, setProfile] = useState(null);
	useEffect(() => {
		Service.request('Profile/GetProfile', { id })
			.then(({ profile }) => setProfile(profile));
	}, []);
	return (
		profile ?
			(
				<PaperContainer className="preview-wrapper">
					<ProfileAvatar
						user={profile}
						avatarImageClassName="preview-avatar"
					/>

					<FlexBox className="preview-info" column>
						<FlexBox align>
							<UsernameLink className="item item-user-name">{profile.name || profile.userName}</UsernameLink>
							<ModBadge badge={profile.badge} />
						</FlexBox>
						<FlexBox align className="profile-info-container" >
							<SecondaryTextBlock className="item profile-info-xp">{`${profile.xp} XP`}</SecondaryTextBlock>
							<IconWithText
								Icon={Level}
								active={false}
							>
								<SecondaryTextBlock>{profile.level}</SecondaryTextBlock>
							</IconWithText>
						</FlexBox>
					</FlexBox>
				</PaperContainer>
			) : null
	);
};

export default ProfilePreview;
