import React from 'react';
import { connect } from 'react-redux';
import UserTooltip from 'components/UserTooltip';
import ProfileAvatar from 'components/ProfileAvatar';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

const MyAvatar = ({ userProfile }) => (
	<UserTooltip userData={userProfile}>
		<ProfileAvatar
			size={40}
			level={userProfile.level}
			badge={userProfile.badge}
			userID={userProfile.id}
			userName={userProfile.name}
			avatarUrl={userProfile.avatarUrl}
		/>
	</UserTooltip>
);

export default connect(mapStateToProps)(MyAvatar);
