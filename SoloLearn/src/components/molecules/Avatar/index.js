import React from 'react';
import PropTypes from 'prop-types';
import { Link, Container } from 'components/atoms';
import { RoundImage } from 'components/molecules';

import { determineBadge, stopPropagation } from 'utils';
import AvatarColors from 'constants/AvatarColors';

import './styles.scss';

const Avatar = ({
	badge,
	userID,
	variant,
	disabled,
	avatarUrl,
	userName,
	...props
}) => {
	const ConditionalContainer = disabled ? Container : Link;
	const { modBadge } = determineBadge(badge);

	return (
		<ConditionalContainer
			to={`/profile/${userID}`}
			onClick={stopPropagation}
			className="avatar-container"
			{...props}
		>
			{avatarUrl
				? (
					<RoundImage
						src={avatarUrl}
						className={`profile-image ${variant} ${modBadge || ''}`}
					/>
				)
				: (
					<RoundImage
						className={`profile-image ${variant} ${modBadge || ''}`}
						style={{
							backgroundColor: AvatarColors[userID % AvatarColors.length],
						}}
					>
						{userName.toUpperCase().charAt(0)}
					</RoundImage>
				)
			}
		</ConditionalContainer>
	);
};

Avatar.propTypes = {
	badge: PropTypes.string,
	disabled: PropTypes.bool,
	userName: PropTypes.string.isRequired,
	variant: PropTypes.oneOf([ 'small', 'normal', 'big' ]),
};

Avatar.defaultProps = {
	badge: null,
	disabled: false,
	variant: 'small',
};

export default Avatar;
