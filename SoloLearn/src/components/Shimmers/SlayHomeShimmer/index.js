import React from 'react';
import { PaperContainer, Container, FlexBox } from 'components/atoms';
import { MainContainer, BaseItem, Line } from '../components';
import './styles.scss';

const SlayHomeShimmer = () => (
	<Container className="slay-home-shimmer-wrapper">
		{
			Array(20).fill(0).map((_, i) => (
				<PaperContainer className="slay-home-shimmer_paper-container" key={i}>
					<MainContainer className="slay-home-shimmer-container">
						<FlexBox justifyBetween align fullWidth className="top-bar">
							<Line width={180} />
							<Line width={77} />
						</FlexBox>
						<Container className="course-chips">
							{ Array(20).fill(0).map((__, idx) => (
								<Container className="shimmer-chip-container" key={idx}>
									<FlexBox align justify column className="chip-wrapper">
										<BaseItem className="chip-body" />
									</FlexBox>
								</Container>
							))}
						</Container>
					</MainContainer>
				</PaperContainer>
			))
		}
	</Container>
);

export default SlayHomeShimmer;
