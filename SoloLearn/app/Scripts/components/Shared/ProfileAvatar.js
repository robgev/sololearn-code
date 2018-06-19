import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import { determineBadge, determineBadgeColor } from 'utils';
import AvatarColors from 'constants/AvatarColors';

import 'styles/profileAvatar.scss';
import avatars from './Avatars';
import ModBadge from './ModBadge';

const DisabledContainer = ({ children, className, style }) => (
	<div style={style} className={className}>
		{children}
	</div>
);

const ProfileAvatar = ({
	style,
	badge,
	userID,
	vertical,
	disabled,
	size = 30,
	userName,
	avatarUrl,
	className,
	withBorder,
	timePassed,
	avatarStyle,
	reversedOrder,
	sideComponent,
	withUserNameBox,
}) => {
	const ConditionalContainer = disabled ? DisabledContainer : Link;
	const modBadge = determineBadge(badge);
	const modBadgeColor = determineBadgeColor(modBadge);
	return (
		<ConditionalContainer to={`/profile/${userID}`} style={style} className="avatar-container">
			<div className={`avatar-wrapper ${vertical ? 'vertical' : ''} ${className || ''}`}>
				<div className="profile-picture-container">
					{ avatarUrl ?
						<Avatar
							size={size}
							src={avatars[userID % 5000].picture.large}
							style={{
								margin: '0 5px',
								...(withBorder ? { border: `4px solid ${modBadgeColor}` } : {}),
								...avatarStyle,
							}}
						/>
						:
						<Avatar
							size={size}
							style={{
								margin: '0 5px',
								backgroundColor: AvatarColors[userID % AvatarColors.length],
								...(withBorder ? { border: `4px solid ${modBadgeColor}` } : {}),
								...avatarStyle,
							}}
						>{userName ? userName.toUpperCase().charAt(0) : ''}
						</Avatar>
					}
					{ withBorder &&
						<ModBadge
							badge={modBadge}
							className="big absolute"
						/>
					}
				</div>
				{sideComponent}
				<div className={`avatar-meta-info-container ${reversedOrder ? 'reversed' : ''}`}>
					{withUserNameBox &&
						<div>
							<p className="avatar-user-name">{userName}
								<ModBadge
									badge={modBadge}
									className="small"
								/>
							</p>
						</div>
					}
					{timePassed &&
						<div>
							<p className="avatar-date-text">{timePassed}</p>
						</div>
					}
				</div>
			</div>
		</ConditionalContainer>
	);
};

export default ProfileAvatar;
