// React modules
import React, { Fragment } from 'react';
// Additional data and components
import BottomToolbar from '../FeedBottomToolbar';
import ProfileAvatar from '../ProfileAvatar';
import {
	Container,
	TextBlock,
	SecondaryTextBlock
} from 'components/atoms';
import { UsernameLink } from 'components/molecules';

import 'styles/Feed/FeedTemplates/Challenge.scss';

const Challenge = ({
	date,
	contest: {
		id, courseID, player, opponent,
	},
}) => (
	<Fragment>
		<Container className="challenge">
			<Container>
				<ProfileAvatar 
					user={player}
				/>
				<Container className="username">
					<UsernameLink to={`/Profile/${player.id}`}>{player.name}</UsernameLink>
				</Container>
			</Container>
			<Container>
				<TextBlock className="score">{`${player.score} : ${opponent.score}`}</TextBlock>
			</Container>
			<Container>
				<ProfileAvatar 
					user={opponent}
				/>
				<Container className="username">
					<UsernameLink to={`/Profile/${opponent.id}`}>{opponent.name}</UsernameLink>
				</Container>
			</Container>
		</Container>
		<BottomToolbar date={date} />
	</Fragment>
);

export default Challenge;
