import React from 'react';
import ProfileAvatar from 'components/ProfileAvatar';
import UserTooltip from 'components/UserTooltip';
import 'styles/userCard.scss';

const UserData = ({ name, xp }) => (
	<div className="user-meta-data">
		<p className="user-name">{ name }</p>
		<p className="user-overview">+{xp} XP</p>
	</div>
);

const UserCard = ({
	xp,
	name,
	level,
	rank,
	userID,
	alltime,
	rangeXp,
	avatarUrl,
}) => (
	<div className="user-card-container">
		<UserTooltip
			userData={{
				level,
				userID,
				avatarUrl,
				userName: name,
			}}
		>
			<ProfileAvatar
				disabled
				userID={userID}
				level={level}
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
		</UserTooltip>
		<div>{ rank }</div>
	</div>
);

export default UserCard;
