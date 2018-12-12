// React modules
import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
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
	t,
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
				<FlexBox className="user-container" column>
					<UsernameLink className="username" to={`/Profile/${player.id}`}>{player.name}</UsernameLink>
					<SecondaryTextBlock>{`${t('common.user-level')} ${player.level}`}</SecondaryTextBlock>
				</FlexBox>
			</FlexBox>
			<Container>
				<TextBlock className="score">{`${player.score} : ${opponent.score}`}</TextBlock>
			</Container>
			<FlexBox column align>
				<ProfileAvatar 
					user={opponent}
				/>
				<FlexBox className="user-container" column>
					<UsernameLink className="username" to={`/Profile/${opponent.id}`}>{opponent.name}</UsernameLink>
					<SecondaryTextBlock>{`${t('common.user-level')} ${opponent.level}`}</SecondaryTextBlock>
				</FlexBox>
			</FlexBox>
		</Container>
		<BottomToolbar date={date} />
	</Fragment>
);

export default translate()(Challenge);
