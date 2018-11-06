import React from 'react';
import { Link, Container } from 'components/atoms';
import { RoundImage } from 'components/molecules';

import { determineBadge, determineBadgeColor, stopPropagation } from 'utils';
import AvatarColors from 'constants/AvatarColors';

import './styles.scss';

const Avatar = ({
	big,
	badge,
	userID,
	disabled,
	avatarUrl,
	userName,
	...props
}) => {
	const ConditionalContainer = disabled ? Container : Link;
	const { modBadge } = determineBadge(badge);
	const modBadgeColor = determineBadgeColor(modBadge);

	return (
		<ConditionalContainer
			to={`/profile/${userID}`}
			onClick={stopPropagation}
			className="avatar-container"
			{...props}
		>
			{ avatarUrl
				? (
					<RoundImage
						src={avatarUrl}
						className={`profile-image ${big ? 'big' : ''} ${modBadge ? 'bordered' : ''}`}
						style={{
							...(modBadge ? { border: `4px solid ${modBadgeColor}` } : {}),
						}}
					/>
				)
				: (
					<RoundImage
						className={`profile-image ${big ? 'big' : ''} ${modBadge ? 'bordered' : ''}`}
						style={{
							backgroundColor: AvatarColors[userID % AvatarColors.length],
							...(modBadge ? { border: `4px solid ${modBadgeColor}` } : {}),
						}}
					>
						{userName.toUpperCase().charAt(0)}
					</RoundImage>
				)
			}
		</ConditionalContainer>
	);
};

Avatar.defaultProps = {
	big: false,
	badge: null,
	disabled: false,
	userName: '',
};

export default Avatar;
