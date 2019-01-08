import React from 'react';
import { Container } from 'components/atoms';
import { MainContainer, Avatar, Line } from '../components';
import './styles.scss';

const LeaderboardShimmer = () => (
	<Container className="leaderboard-shimmer-wrapper">
		{Array(20).fill(0).map((_, i) => (
			<MainContainer className="leaderboard-shimmer-container" key={i}>
				<Avatar round />
				<Container className="leaderboard-text-info">
					<Line width={150} />
					<Line width={80} />
				</Container>
			</MainContainer>
		))}
	</Container>
);

export default LeaderboardShimmer;
