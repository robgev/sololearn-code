import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

// i18n
import { translate } from 'react-i18next';

const UserData = ({
	t, name, followers, level,
}) => (
	<div className="user-meta-data">
		<p className="user-name">{ name }</p>
		<p className="user-overview">{ followers } {t('common.user-followers')} | {t('common.user-level')} { level }</p>
	</div>
);

const UserCard = ({
	t,
	id,
	level,
	name,
	onBlock,
	followers,
	avatarUrl,
	blockedState,
}) => (
	<div className="user-card-container">
		<ProfileAvatar
			disabled
			userID={id}
			userName={name}
			avatarUrl={avatarUrl}
			className="user-info"
			sideComponent={
				<UserData
					t={t}
					name={name}
					level={level}
					followers={followers}
				/>
			}
		/>
		<RaisedButton
			onClick={onBlock}
			labelStyle={{ color: 'white' }}
			label={blockedState ? t('common.unblock-user') : t('common.block-user')}
			backgroundColor={blockedState ? '#84BC4F' : '#587581'}
		/>
	</div>
);

export default translate()(UserCard);
