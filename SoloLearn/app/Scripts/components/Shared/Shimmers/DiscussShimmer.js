import React from 'react';
import 'styles/components/Shared/Shimmers/DiscussShimmer.scss';

const DiscussShimmer = () => {
	const renderContainers = Array(20).fill(0).map((_, i) => (
		<div className="discuss-shimmer-container" style={{ marginTop: 20 + (i * 120) }} key={i}>
			<div className="discuss-content-placeholder">
				<div className="placeholder post-name" />
				<div className="placeholder post-topics" />
				<div className="post-tags">
					<div className="placeholder tag tag1" />
					<div className="placeholder tag tag2" />
					<div className="placeholder tag tag3" />
				</div>
			</div>
			<div className="placeholder discuss-date-placeholder" />
		</div>
	));
	return (
		<div className="shimmer-wrapper">
			{renderContainers}
			<div className="discuss-shimmer-animation" />
		</div>
	);
};

export default DiscussShimmer;
