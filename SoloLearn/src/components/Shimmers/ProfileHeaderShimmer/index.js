import React from 'react';
import { FlexBox } from 'components/atoms';
import { MainContainer, Avatar, Line } from '../components';
import './styles.scss';

const ProfileHeaderShimmer = () => (
	<MainContainer className="profile-header-shimmer-container">
		<Avatar big round />
		<FlexBox column align justify className="user-info">
			<Line width={330} />
			<Line width={110} />
		</FlexBox>
	</MainContainer>
);

export default ProfileHeaderShimmer;
