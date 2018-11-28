// React modules
import React from 'react';
import { Link } from 'react-router';
import ProfileAvatar from './ProfileAvatar';
import { Container, TextBlock } from 'components/atoms';
import {
	UsernameLink,
	ModBadge,
	UserTooltip,
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
			<TextBlock className="feed-item-title">
				<UsernameLink
					to={`/profile/${user.id}`}
					className="user-name-link"
				>
					{user.name}
					<ModBadge
						className="badge"
						badge={user.badge}
					/>
				</UsernameLink>
				<TextBlock className="title">
					{title}
				</TextBlock>
			</TextBlock>
			{children}
		</Container>
	</Container>
);

export default FeedItemBase;
