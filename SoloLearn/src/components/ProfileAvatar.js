import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';

import { determineBadge, determineBadgeColor, stopPropagation } from 'utils';
import AvatarColors from 'constants/AvatarColors';

import 'styles/profileAvatar.scss';
import ModBadge from './ModBadge';

const DisabledContainer = props => (
	<div {...props} />
);

const ProfileAvatar = ({
	style,
	badge,
	userID,
	vertical,
	size = 30,
	userName,
	avatarUrl,
	className,
	withBorder,
	timePassed,
	avatarStyle,
	reversedOrder,
	sideComponent,
	disabled = false,
	withUserNameBox,
	omitInlineModBadge = false,
}) => {
	const ConditionalContainer = disabled ? DisabledContainer : Link;
	const { modBadge, levelBadge } = determineBadge(badge);
	const modBadgeColor = determineBadgeColor(modBadge);
	return (
		<ConditionalContainer
			style={style}
			to={`/profile/${userID}`}
			onClick={stopPropagation}
			className="avatar-container"
		>
			<div className={`avatar-wrapper ${vertical ? 'vertical' : ''} ${className || ''}`}>
				<div className="profile-picture-container">
					{ avatarUrl ?
						<Avatar
							size={size}
							src={avatarUrl}
							style={{
								margin: '0 5px',
								...((withBorder && modBadge) ? { border: `4px solid ${modBadgeColor}` } : {}),
								...avatarStyle,
							}}
						/>
						:
						<Avatar
							size={size}
							style={{
								margin: '0 5px',
								backgroundColor: AvatarColors[userID % AvatarColors.length],
								...((withBorder && modBadge) ? { border: `4px solid ${modBadgeColor}` } : {}),
								...avatarStyle,
							}}
						>{userName ? userName.toUpperCase().charAt(0) : ''}
						</Avatar>
					}
					{ levelBadge && !(modBadge && withBorder) &&
						<img
							alt="LB"
							className="level-badge"
							src={`/assets/badge_${levelBadge}${withBorder ? '_profile' : ''}.png`}
						/>
					}
					{ (withBorder && modBadge) &&
						<ModBadge
							badge={modBadge}
							className="big absolute"
						/>
					}
					{

					}
				</div>
				{sideComponent}
				<div className={`avatar-meta-info-container ${reversedOrder ? 'reversed' : ''}`}>
					{withUserNameBox &&
						<div>
							<p className="avatar-user-name hoverable">
								<span className="avatar-user-name-wrapper">{userName}</span>
								{ !omitInlineModBadge &&
									<ModBadge
										badge={modBadge}
										className="small"
									/>
								}
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
