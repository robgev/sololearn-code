import React from 'react';
import { Container } from 'components/atoms';
import {	RaisedButton } from 'components/molecules';
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
			isBlocked={blockedState}
			t={t}
		/>
		<RaisedButton
			className={`unblock-button ${blockedState ? 'unblock' : ''}`}
			onClick={onBlock}
		>
			{blockedState ? t('common.unblock-user') : t('common.block-user')}
		</RaisedButton>
	</Container>
);

export default translate()(UserCard);
