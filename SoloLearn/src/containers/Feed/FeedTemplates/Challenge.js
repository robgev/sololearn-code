// React modules
import React, { Fragment } from 'react';
// Additional data and components
import BottomToolbar from '../FeedBottomToolbar';
//import ProfileAvatar from '../ProfileAvatar';
import {
	Container,
	TextBlock,
	SecondaryTextBlock,
	FlexBox,
} from 'components/atoms';
import { UsernameLink, ProfileAvatar } from 'components/molecules';

import 'styles/Feed/FeedTemplates/Challenge.scss';

const Challenge = ({
	date,
	contest: {
		id, courseID, player, opponent,
	},
}) => (
	<Fragment>
		<Container className="challenge">
			<FlexBox column align>
				<ProfileAvatar 
					user={player}
				/>
				<Container className="username">
					<UsernameLink to={`/Profile/${player.id}`}>{player.name}</UsernameLink>
				</Container>
			</FlexBox>
			<Container>
				<TextBlock className="score">{`${player.score} : ${opponent.score}`}</TextBlock>
			</Container>
			<FlexBox column align>
				<ProfileAvatar 
					user={opponent}
				/>
				<Container className="username">
					<UsernameLink to={`/Profile/${opponent.id}`}>{opponent.name}</UsernameLink>
				</Container>
			</FlexBox>
		</Container>
		<BottomToolbar date={date} />
	</Fragment>
);

export default Challenge;
