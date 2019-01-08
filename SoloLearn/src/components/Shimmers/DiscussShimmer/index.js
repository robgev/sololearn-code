import React from 'react';
import { FlexBox, Container } from 'components/atoms';
import { Line, Tag, MainContainer } from '../components';
import './styles.scss';

const DiscussShimmer = () => (
	<div className="discuss-shimmer-wrapper">
		{Array(20).fill(0).map((_, i) => (
			<MainContainer className="discuss-shimmer-container" key={i}>
				<Container>
					<Line width={260} />
					<Line width={200} />
					<FlexBox justifyBetween className="post-tags">
						<Tag width="40%" />
						<Tag width="30%" />
						<Tag width="25%" />
					</FlexBox>
				</Container>
				<FlexBox fullWidth justifyEnd>
					<Line width="15%" />
				</FlexBox>
			</MainContainer>
		))}
	</div>
);

export default DiscussShimmer;
