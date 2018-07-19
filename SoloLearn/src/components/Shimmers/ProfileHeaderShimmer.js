import React from 'react';
import 'styles/components/Shimmers/ProfileHeaderShimmer.scss';

const ProfileHeaderShimmer = () => (
	<div className="profile-header-shimmer-container">
		<div className="avatar-container">
			<div className="avatar" />
		</div>
		<div className="user-info">
			<div className="text-line short" />
			<div className="text-line long" />
		</div>
		<div className="profile-header-shimmer-shimmer" />
	</div>
);

export default ProfileHeaderShimmer;
