import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import {
	Container,
	TextBlock,
	SecondaryTextBlock,
	FlexBox,
	IconLabel,
} from 'components/atoms';
import { UsernameLink, ProfileAvatar, IconWithText } from 'components/molecules';
import { Level } from 'components/icons';

import './styles.scss';

const Challenge = ({
	t,
	date,
	contest: {
		player, opponent,
	},
}) => (
	<Fragment>
		<Container className="challenge">
			<FlexBox align>
				<FlexBox className="user-container player" column>
					<UsernameLink className="username" to={`/Profile/${player.id}`}>{player.name}</UsernameLink>
					<FlexBox align className="challenger_info">
						<SecondaryTextBlock>{player.xp} XP </SecondaryTextBlock>
						·{' '}
						<IconWithText justify Icon={Level} className="challenge_icon">
							<IconLabel className="challenge_label">{' '}{player.level}</IconLabel>
						</IconWithText>
					</FlexBox>
				</FlexBox>
				<ProfileAvatar
					user={player}
				/>
			</FlexBox>
			<Container>
				<TextBlock className="score">{`${player.score} : ${opponent.score}`}</TextBlock>
			</Container>
			<FlexBox align>
				<ProfileAvatar
					user={opponent}
				/>
				<FlexBox className="user-container opponent" column>
					<UsernameLink className="username" to={`/Profile/${opponent.id}`}>{opponent.name}</UsernameLink>
					<FlexBox align className="challenger_info">
						<SecondaryTextBlock>{opponent.xp} XP </SecondaryTextBlock>
						·{' '}
						<IconWithText justify Icon={Level} className="challenge_icon">
							<IconLabel className="challenge_label">{' '}{opponent.level}</IconLabel>
						</IconWithText>
					</FlexBox>
				</FlexBox>
			</FlexBox>
		</Container>
	</Fragment>
);

export default translate()(Challenge);
