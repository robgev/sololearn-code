import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

const UserData = ({ name, followers, level }) => (
	<div className="user-meta-data">
		<p className="user-name">{ name }</p>
		<p className="user-overview">{ followers } Followers | Level { level }</p>
	</div>
);

const UserCard = ({
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
					name={name}
					level={level}
					followers={followers}
				/>
			}
		/>
		<RaisedButton
			onClick={onBlock}
			labelStyle={{ color: 'white' }}
			label={blockedState ? 'Unblock' : 'Block'}
			backgroundColor={blockedState ? '#84BC4F' : '#587581'}
		/>
	</div>
);

export default UserCard;
