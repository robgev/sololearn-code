import React from 'react';
import { Container, SecondaryTextBlock } from 'components/atoms';
import { UsernameLink, ProfileAvatar } from 'components/molecules';
import { updateDate } from 'utils';

const Author = ({
	badge, userID, avatarUrl, userName, date, level,
}) => (
	<Container className="user">
		<Container className="name-date">
			<UsernameLink to={`/profile/${userID}`}>{userName}</UsernameLink>
			<SecondaryTextBlock>{updateDate(date)}</SecondaryTextBlock>
		</Container>
		<ProfileAvatar user={{
			badge, id: userID, avatarUrl, name: userName, level,
		}}
		/>
	</Container>
);

export default Author;
