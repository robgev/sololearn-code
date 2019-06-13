// React modules
import React from 'react';
import { Container, TextBlock, FlexBox } from 'components/atoms';
import {
	UsernameLink,
	ModBadge,
	ProfileAvatar,
} from 'components/molecules';

import 'styles/Feed/FeedItemBase.scss';
import FeedDateContainer from './FeedDateContainer';

const FeedItemBase = ({
	title,
	user,
	children,
	date,
	hideTitle,
}) => (
	<Container className="feed-item-content">
		<ProfileAvatar
			user={user}
		/>
		<Container className="wrapper">
			<FlexBox align className="feed-item-title">
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
				{ !hideTitle &&
					<TextBlock className="title">
						{title}
					</TextBlock>
				}
			</FlexBox>
			<Container>
				<FeedDateContainer date={date} />
			</Container>
			{children}
		</Container>
	</Container>
);

export default FeedItemBase;
