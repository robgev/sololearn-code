import React from 'react';
import { Container } from 'components/atoms';
import { MainContainer, Avatar, Line } from '../components';
import './styles.scss';

const CodeShimmer = () => (
	<Container className="code-shimmer-root">
		{Array(20).fill(0).map((_, i) => (
			<MainContainer className="code-shimmer-container" key={i}>
				<Avatar round />
				<Container className="code-text-info">
					<Line width={330} />
					<Line width={110} />
				</Container>
			</MainContainer>
		))}
	</Container>
);

export default CodeShimmer;
