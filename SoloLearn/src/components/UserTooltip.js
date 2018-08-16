import React from 'react';
import { Tooltip } from 'react-tippy';
import UserCard from './UserCard';

const UserTooltip = ({
	follow,
	children,
	userData: {
		id,
		level,
		name,
		userName,
		avatarUrl,
		userID,
	},
}) => (
	<Tooltip
		arrow
		interactive
		useContext
		tabIndex="0"
		theme="light"
		position="top-start"
		unmountHTMLWhenHide
		html={
			<UserCard
				level={level}
				id={userID || id}
				avatarUrl={avatarUrl}
				name={userName || name}
				withFollowButton={follow}
				className="profile-avatar-user-card profile-avatar-reset"
			/>
		}
	>
		{children}
	</Tooltip>
);

export default UserTooltip;
