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
import types from 'defaults/appTypes';

const FeedItemBase = ({
	title, user, children, date, type,
}) => (
	<Container className="feed-item-content">
		<FlexBox fullWidth>
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
					{
						type !== types.leveledUp || type !== types.joined
							? <TextBlock className="title">
								{title}
							</TextBlock>
							: null
					}
				</FlexBox>
				<Container>
					<FeedDateContainer date={date} />
				</Container>
			</Container>
		</FlexBox>
		{children}
	</Container>
);
export default FeedItemBase;
