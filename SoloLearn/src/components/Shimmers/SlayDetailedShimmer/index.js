import React from 'react';
import { PaperContainer, FlexBox } from 'components/atoms';
import { BaseItem, MainContainer } from '../components';
import './styles.scss';

const SlayDetailedShimmer = () => (
	<PaperContainer className="slay-detailed-shimmer-wrapper">
		<MainContainer>
			<BaseItem className="collection-title" />
		</MainContainer>
		<FlexBox fullWidth align justify className="course-chips">
			{ Array(42).fill(0).map((__, idx) => (
				<MainContainer className="shimmer-chip-container" key={idx}>
					<FlexBox column align justify>
						<BaseItem className="chip-body" />
						<BaseItem className="chip-name" />
					</FlexBox>
				</MainContainer>
			))}
		</FlexBox>
	</PaperContainer>
);

export default SlayDetailedShimmer;
