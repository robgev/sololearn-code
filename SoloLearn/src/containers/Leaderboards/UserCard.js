import React from 'react';
import { ModBadge, ProfileAvatar, UsernameLink } from 'components/molecules';
import { FlexBox, Container, SecondaryTextBlock } from 'components/atoms';
import './UserCard.scss';

const UserData = ({
	name, rangeXp, userID, badge,
}) => (
	<Container className="user-meta-data">
		<UsernameLink to={`/profile/${userID}`}>
			{ name }
		</UsernameLink>
		<ModBadge
			className="badge"
			badge={badge}
		/>
		<SecondaryTextBlock className="info">+{rangeXp} XP</SecondaryTextBlock>
	</Container>
);

const UserCard = ({
	user,
}) => (
	<FlexBox justifyBetween align>
		<FlexBox>
			<ProfileAvatar user={{ ...user, id: user.userID }} />
			<UserData {...user} />
		</FlexBox>
		<Container>{ user.rank }</Container>
	</FlexBox>
);

export default UserCard;
