import React from 'react';
import PropTypes from 'prop-types';
import { FlexBox, Image } from 'components/atoms';
import { Avatar, ModBadge } from 'components/molecules';

import { determineBadge } from 'utils';

import './styles.scss';

const UserAvatar = ({ size, user, link }) => {
	const { modBadge, levelBadge } = determineBadge(user.badge);
	return (
		<FlexBox
			align
			column
			className={`profile_user-avatar-container ${modBadge || ''}`}
		>
			<Avatar
				disabled={!link}
				variant={size}
				userID={user.id}
				badge={user.badge}
				userName={user.name}
				avatarUrl={user.avatarUrl}
				link={link}
			/>
			{modBadge &&
				<ModBadge
					badge={user.badge}
					big={size === 'big'}
					className="profile_user-avatar-mod-badge"
				/>
			}
			{(levelBadge && !modBadge) &&
				<Image
					alt="LB"
					className="profile_user-avatar-level-badge"
					src={`/assets/badge_${levelBadge}.png`}
				/>
			}
		</FlexBox>
	);
};

UserAvatar.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		badge: PropTypes.string,
		avatarUrl: PropTypes.string,
	}).isRequired,
	size: PropTypes.oneOf([ 'small', 'normal', 'big' ]),
};

UserAvatar.defaultProps = {
	size: 'big',
};

export default UserAvatar;
