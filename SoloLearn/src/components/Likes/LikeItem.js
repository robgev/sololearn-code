import React from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import ProfileAvatar from 'components/ProfileAvatar';
import FlatButton from 'material-ui/FlatButton';
import UserTooltip from 'components/UserTooltip';

const LikeItem = observer(({ t, user, onFollowClick }) => (
	<div>
		<UserTooltip userData={user}>
			<ProfileAvatar
				userID={user.id}
				withUserNameBox
				level={user.level}
				badge={user.badge}
				userName={user.name}
				avatarUrl={user.avatarUrl}
			/>
		</UserTooltip>
		<FlatButton
			label={user.isFollowing ? t('common.user-following') : t('common.follow-user')}
			onClick={() => onFollowClick(user.id)}
		/>
	</div>
));

export default translate()(LikeItem);
