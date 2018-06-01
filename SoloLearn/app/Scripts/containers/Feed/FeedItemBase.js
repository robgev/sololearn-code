// React modules
import React from 'react';
import { Link } from 'react-router';
import { determineBadge } from 'utils';
import ModBadge from 'components/Shared/ModBadge';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import 'styles/Feed/FeedItemBase.scss';

const FeedItemBase = ({
	title, user, children,
}) => (
	<div className="feed-item-content">
		<ProfileAvatar
			size={40}
			userID={user.id}
			badge={user.badge}
			userName={user.name}
			avatarUrl={user.avatarUrl}
		/>
		<div className="wrapper">
			<p className="feed-item-title">
				<Link
					to={`/profile/${user.id}`}
					className="user-name-link"
				>
					<span className="user-name-wrapper">
						{`${user.name} `}
					</span>
					<ModBadge
						className="small"
						badge={determineBadge(user.badge)}
					/>
				</Link>
				{title}
			</p>
			{children}
		</div>
	</div>
);

export default FeedItemBase;
