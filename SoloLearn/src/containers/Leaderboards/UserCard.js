import React from 'react';
import { ProfileAvatar, UsernameLink, } from 'components/molecules';
import { Container, SecondaryTextBlock, } from 'components/atoms';
import './UserCard.scss';

const UserData = ({ name, xp, id }) => (
	<Container className="user-meta-data">
		<UsernameLink to={`/profile/${id}`}>{ name }</UsernameLink>
		<SecondaryTextBlock className="info">+{xp} XP</SecondaryTextBlock>
	</Container>
);

const UserCard = ({
	user
}) => (
	<Container className="user-card-container">
		<Container className="user-info">
			<ProfileAvatar user={user} />
			<UserData {...user}/>
		</Container>
		<Container>{ user.rank }</Container>
	</Container>
);

export default UserCard;
