import React from 'react';
// import { determineBadge } from 'utils';
import { Container } from 'components/atoms';
import { Avatar, UserTooltip } from 'components/molecules';

import './styles.scss';

// const { levelBadge } = determineBadge(user.badge);
const ProfileAvatar = ({
	user,
	size,
	className,
}) => (
	<UserTooltip userData={user} placement="top">
		<Container
			className={`molecule_profile-avatar ${className}`}
		>
			<Container className="avatar-wrapper">
				<Container className="profile-container">
					<Avatar
						avatarUrl={user.avatarUrl}
						userName={user.name}
						userID={user.id}
						badge={user.badge}
						variant={size}
						disabled
					/>
					{/* { levelBadge &&
							<Image
								alt="LB"
								className="level-badge"
								src={`/assets/badge_${levelBadge}.png`}
							/>
						} */}
				</Container>
			</Container>
		</Container>
	</UserTooltip>
);

ProfileAvatar.defaultProps = {
	className: '',
	size: 'small',
};

export default ProfileAvatar;
