import React, { Fragment } from 'react';
import { Container, PaperContainer, FlexBox } from 'components/atoms';
import { MainContainer, Line, Avatar } from '../components';
import './styles.scss';

const FeedShimmer = () => (
	<Fragment>
		{Array(20).fill(0).map((_, i) => (
			<PaperContainer className="feed-shimmer_paper-container" key={i}>
				<MainContainer>
					<FlexBox column justifyBetween fullWidth className="feed-shimmer-container">
						<FlexBox className="post-head">
							<Avatar round className="avatar" />
							<FlexBox column>
								<Line width={250} />
								<Line width={150} />
							</FlexBox>
						</FlexBox>
						<Container>
							<Line width={300} />
							<Line width={340} />
							<Line width={260} />
						</Container>
						<FlexBox justifyEnd alignEnd>
							<Line width={70} className="date" />
						</FlexBox>
					</FlexBox>
				</MainContainer>
			</PaperContainer>
		))}
	</Fragment>
);

export default FeedShimmer;
