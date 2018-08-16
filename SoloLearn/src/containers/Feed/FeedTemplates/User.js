// React modules
import React from 'react';
import { Link } from 'react-router';
import ProfileAvatar from 'components/ProfileAvatar';
import UserTooltip from 'components/UserTooltip';

import 'styles/Feed/FeedTemplates/User.scss';

const DisabledContainer = ({
	children, className, style, onClick,
}) => (
	<div
		style={style}
		tabIndex="0"
		role="button"
		onClick={onClick}
		className={className}
	>
		{children}
	</div>
);

const User = ({ user, disabled }) => {
	const ConditionalContainer = disabled ? DisabledContainer : Link;

	return (
		<ConditionalContainer
			to={`/profile/${user.id}`}
			className="challenge-user"
		>
			<UserTooltip userData={user}>
				<ProfileAvatar
					vertical
					size={60}
					level={user.level}
					userID={user.id}
					withUserNameBox
					disabled={disabled}
					userName={user.name}
					avatarUrl={user.avatarUrl}
				/>
			</UserTooltip>
		</ConditionalContainer>
	);
};

export default User;
