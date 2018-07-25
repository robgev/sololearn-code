// React modules
import React from 'react';
import { Link } from 'react-router';
import { determineBadge } from 'utils';
import ModBadge from 'components/ModBadge';
import ProfileAvatar from 'components/ProfileAvatar';

import 'styles/Feed/FeedItemBase.scss';

const FeedItemBase = ({
	title, user, children, feedItemId,
}) => (
	<div className="feed-item-content">
		<ProfileAvatar
			size={40}
			withTooltip
			userID={user.id}
			level={user.level}
			badge={user.badge}
			userName={user.name}
			avatarUrl={user.avatarUrl}
			avatarStyle={{ margin: 0 }}
			tooltipId={`feedItem-${feedItemId}`}
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