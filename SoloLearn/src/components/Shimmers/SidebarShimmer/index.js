import React from 'react';
import { Container, FlexBox } from 'components/atoms';
import { MainContainer, Avatar, Line } from '../components';
import './styles.scss';

const SidebarShimmer = ({ className = '', round, noTitle }) => (
	<Container className={`sidebar-shimmer-wrapper ${className}`}>
		{ !noTitle &&
			<MainContainer>
				<FlexBox align justifyBetween className="sidebar-title">
					<Line width="30%" />
					<Line width="20%" />
				</FlexBox>
			</MainContainer>
		}
		{Array(10).fill(0).map((_, i) => (
			<MainContainer className="sidebar-shimmer-container" key={i}>
				<Avatar round={round} />
				<Container className="sidebar-info">
					<Line width="50%" />
					<Line width="35%" />
				</Container>
			</MainContainer>
		))}
	</Container>
);

export default SidebarShimmer;
