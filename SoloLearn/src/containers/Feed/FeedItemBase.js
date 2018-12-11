// React modules
import React from 'react';
import { Container, TextBlock } from 'components/atoms';
import {
	UsernameLink,
	ModBadge,
	ProfileAvatar,
} from 'components/molecules';

import 'styles/Feed/FeedItemBase.scss';

const FeedItemBase = ({
	title, user, children,
}) => (
	<Container className="feed-item-content">

		<ProfileAvatar
			user={user}
		/>
		<Container className="wrapper">
			<Container className="feed-item-title">
				<UsernameLink
					to={`/profile/${user.id}`}
					className="user-name-link"
				>
					{user.name}
				</UsernameLink>
				<ModBadge
					className="badge"
					badge={user.badge}
				/>
				<TextBlock className="title">
					{title}
				</TextBlock>
			</Container>
			{children}
		</Container>
	</Container>
);

export default FeedItemBase;
