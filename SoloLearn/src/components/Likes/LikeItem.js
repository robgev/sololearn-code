import React from 'react';
import { observer } from 'mobx-react';
import ProfileAvatar from 'components/ProfileAvatar';
import FlatButton from 'material-ui/FlatButton';

const LikeItem = observer(({ user, onFollowClick }) => (
	<div>
		<ProfileAvatar
			withTooltip
			userID={user.id}
			withUserNameBox
			level={user.level}
			badge={user.badge}
			userName={user.name}
			avatarUrl={user.avatarUrl}
			tooltipId={`likes-${user.id}`}
		/>
		<FlatButton
			label={user.isFollowing ? 'Unfollow' : 'Follow'}
			onClick={() => onFollowClick(user.id)}
		/>
	</div>
));

export default LikeItem;
