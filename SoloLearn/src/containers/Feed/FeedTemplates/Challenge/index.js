import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import {
	Container,
	TextBlock,
	SecondaryTextBlock,
	FlexBox,
	IconLabel,
	HorizontalDivider,
} from 'components/atoms';
import { UsernameLink, ProfileAvatar, IconWithText } from 'components/molecules';
import { formatDate } from 'utils';
import { Level } from 'components/icons';

import './styles.scss';

const Challenge = ({
	t,
	date,
	merged,
	language,
	contest: {
		player, opponent,
	},
}) => (
	<Fragment>
		<FlexBox justify align className={`challenge ${merged ? 'merged' : ''}`}>
			{ merged &&
			<SecondaryTextBlock className="challenge-date">{formatDate(date)}</SecondaryTextBlock>
			}
			<FlexBox align justifyEnd className="challenger_container">
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
			<FlexBox align justify column>
				<TextBlock className="challenge-text score">
					{`${player.score} : ${opponent.score}`}
				</TextBlock>
				<TextBlock className="challenge-text language">
					{language}
				</TextBlock>
			</FlexBox>
			<FlexBox align justifyStart className="challenger_container">
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
		</FlexBox>
		{ merged &&
		<HorizontalDivider className="challenge-divider" />
		}
	</Fragment>
);

export default translate()(Challenge);
