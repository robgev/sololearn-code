import React from 'react';
import { Container, SecondaryTextBlock } from 'components/atoms';
import {
	Avatar,
	RaisedButton,
	UsernameLink
} from 'components/molecules';
import { UserCard as Card } from 'components/organisms';

// i18n
import { translate } from 'react-i18next';

const UserCard = ({
	t,
	onBlock,
	blockedState,
	...user
}) => (
	<Container>
		<Card
			user={user}
			t={t}
		/>
		<RaisedButton
			style={{float:'right'}}
			onClick={onBlock}
			label={blockedState ? t('common.unblock-user') : t('common.block-user')}
		>
			{blockedState ? t('common.unblock-user') : t('common.block-user')}
		</RaisedButton>
	</Container>
);

export default translate()(UserCard);
