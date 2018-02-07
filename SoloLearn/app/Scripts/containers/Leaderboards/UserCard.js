import React from 'react';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import 'styles/userCard.scss';

const UserData = ({ name, xp }) => (
	<div className="user-meta-data">
		<p className="user-name">{ name }</p>
		<p className="user-overview">+{xp} XP</p>
	</div>
);

const UserCard = ({
	id,
	xp,
	rank,
	name,
	avatarUrl,
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
					xp={xp}
					name={name}
				/>
			}
		/>
		<div>{ rank }</div>
	</div>
);

export default UserCard;
