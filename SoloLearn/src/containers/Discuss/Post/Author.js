import React from 'react';
import { Container, SecondaryTextBlock } from 'components/atoms';
import { Avatar, UsernameLink } from 'components/molecules';
import { updateDate } from 'utils';

const Author = ({
	badge, userID, avatarUrl, userName, date,
}) => (
	<Container className="user">
		<Container className="name-date">
			<UsernameLink to={`/profile/${userID}`}>{userName}</UsernameLink>
			<SecondaryTextBlock>{updateDate(date)}</SecondaryTextBlock>
		</Container>
		<Avatar
			badge={badge}
			userID={userID}
			avatarUrl={avatarUrl}
			userName={userName}
		/>
	</Container>
);

export default Author;
