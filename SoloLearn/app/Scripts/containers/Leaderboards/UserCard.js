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
	name,
	alltime,
	rank,
	rangeXp,
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
					name={name}
					xp={alltime ? xp : rangeXp}
				/>
			}
		/>
		<div>{ rank }</div>
	</div>
);

export default UserCard;
