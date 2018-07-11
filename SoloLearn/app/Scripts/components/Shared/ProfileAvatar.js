import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import ToolTip from 'react-portal-tooltip';
import Avatar from 'material-ui/Avatar';

import { determineBadge, determineBadgeColor } from 'utils';
import AvatarColors from 'constants/AvatarColors';

import 'styles/profileAvatar.scss';
import ModBadge from './ModBadge';
import UserCard from './UserCard';

const DisabledContainer = props => (
	<div {...props} />
);

class ProfileAvatar extends PureComponent {
state = {
	isTooltipActive: false,
}

toggleTooltip = () => {
	this.setState(state => ({ isTooltipActive: !state.isTooltipActive }));
}

render() {
	const {
		style,
		level,
		badge,
		userID,
		vertical,
		disabled,
		size = 30,
		userName,
		avatarUrl,
		tooltipId,
		className,
		withBorder,
		timePassed,
		avatarStyle,
		withTooltip,
		reversedOrder,
		sideComponent,
		withUserNameBox,
	} = this.props;
	const { isTooltipActive } = this.state;
	const ConditionalContainer = disabled ? DisabledContainer : Link;
	const modBadge = determineBadge(badge);
	const modBadgeColor = determineBadgeColor(modBadge);
	return (
		<ConditionalContainer
			style={style}
			id={tooltipId}
			to={`/profile/${userID}`}
			className="avatar-container"
			onMouseEnter={this.toggleTooltip}
			onMouseLeave={this.toggleTooltip}
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
					{ (withBorder && modBadge) &&
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
			{ withTooltip &&
				<ToolTip
					align="center"
					position="top"
					arrow="left"
					active={isTooltipActive}
					parent={`#${tooltipId}`}
				>
					<UserCard
						id={userID}
						level={level}
						name={userName}
						className="profile-avatar-user-card profile-avatar-reset"
					/>
				</ToolTip>
			}
		</ConditionalContainer>
	);
}
}

export default ProfileAvatar;
