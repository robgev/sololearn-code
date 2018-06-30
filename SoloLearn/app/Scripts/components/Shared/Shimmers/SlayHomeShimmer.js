import React from 'react';
import Paper from 'material-ui/Paper';
import 'styles/components/Shared/Shimmers/SlayHomeShimmer.scss';

const SlayHomeShimmer = () => {
	const renderContainers = Array(20).fill(0).map((_, i) => (
		<Paper
			style={{
				height: 175,
				padding: 20,
				marginBottom: 10,
				position: 'relative',
			}}
			key={i}
		>
			<div className="slay-home-shimmer-container">
				<div className="top-bar">
					<div className="course-name" />
					<div className="load-more" />
				</div>
				<div className="course-chips">
					{ Array(20).fill(0).map((__, idx) => (
						<div className="shimmer-chip-container" key={idx}>
							<span className="chip-wrapper">
								<div className="chip-body" />
								<div className="chip-name" />
							</span>
						</div>
					))}
				</div>
				<div className="slay-home-shimmer-shimmer" />
			</div>
		</Paper>
	));
	return (
		<div className="slay-home-shimmer-wrapper">
			{renderContainers}
		</div>
	);
};

export default SlayHomeShimmer;
