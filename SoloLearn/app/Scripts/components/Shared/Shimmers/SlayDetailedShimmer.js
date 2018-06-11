import React from 'react';
import Paper from 'material-ui/Paper';
import 'styles/components/Shared/Shimmers/SlayDetailedShimmer.scss';

const SlayDetailedShimmer = () => (
	<Paper className="slay-detailed-shimmer-wrapper">
		<div className="collection-title-container">
			<div className="collection-title" />
			<div className="slay-home-shimmer-shimmer" />
		</div>
		<div className="course-chips">
			{ Array(40).fill(0).map((__, idx) => (
				<div className="shimmer-chip-container" key={idx}>
					<span className="chip-wrapper">
						<div className="chip-body" />
						<div className="chip-name" />
					</span>
					<div className="slay-home-shimmer-shimmer" />
				</div>
			))}
		</div>
	</Paper>
);

export default SlayDetailedShimmer;
