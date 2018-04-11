import React from 'react';
import 'styles/components/Shared/Shimmers/SlayHomeShimmer.scss';

const SlayHomeShimmer = () => {
	const renderContainers = Array(20).fill(0).map((_, i) => (
		<div className="slay-home-shimmer-container" style={{ marginTop: 20 + (i * 170) }} key={i}>
			<div className="top-bar">
				<div className="course-name" />
				<div className="load-more" />
			</div>
			<div className="course-chips">
				{ Array(20).fill(0).map((__, idx) => (
					<div className="shimmer-chip-container" key={idx}>
						<div className="chip-body" />
						<div className="chip-name" />
					</div>
				))}
			</div>
		</div>
	));
	return (
		<div className="shimmer-wrapper">
			{renderContainers}
			<div className="slay-home-shimmer-shimmer" />
		</div>
	);
};

export default SlayHomeShimmer;
