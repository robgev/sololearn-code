import React from 'react';
import { observer } from 'mobx-react';
import ProfileAvatar from 'components/ProfileAvatar';
import FlatButton from 'material-ui/FlatButton';
import UserTooltip from 'components/UserTooltip';

const LikeItem = observer(({ user, onFollowClick }) => (
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
			label={user.isFollowing ? 'Unfollow' : 'Follow'}
			onClick={() => onFollowClick(user.id)}
		/>
	</div>
));

export default LikeItem;
