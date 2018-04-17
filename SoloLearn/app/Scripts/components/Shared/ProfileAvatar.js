import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import 'styles/profileAvatar.scss';

const DisabledContainer = ({ children, className, style }) => (
	<div style={style} className={className}>
		{children}
	</div>
);

const ProfileAvatar = ({
	style,
	userID,
	vertical,
	disabled,
	size = 30,
	userName,
	avatarUrl,
	className,
	timePassed,
	avatarStyle,
	reversedOrder,
	sideComponent,
	withUserNameBox,
}) => {
	const ConditionalContainer = disabled ? DisabledContainer : Link;
	return (
		<ConditionalContainer to={`/profile/${userID}`} style={style} className="avatar-container">
			<div className={`avatar-wrapper ${vertical ? 'vertical' : ''} ${className || ''}`}>
				{ avatarUrl ?
					<Avatar
						size={size}
						src={avatarUrl}
						style={{ margin: '0 5px', ...avatarStyle }}
					/>
					:
					<Avatar
						size={size}
						style={{ margin: '0 5px', ...avatarStyle }}
					>{userName.toUpperCase().charAt(0)}
					</Avatar>
				}
				{sideComponent}
				<div className={`avatar-meta-info-container ${reversedOrder ? 'reversed' : ''}`}>
					{ withUserNameBox &&
					<div>
						<p className="avatar-user-name">{userName}</p>
					</div>
					}
					{ timePassed &&
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
