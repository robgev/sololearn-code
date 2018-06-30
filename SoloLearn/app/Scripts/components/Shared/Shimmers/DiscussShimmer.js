import React from 'react';
import 'styles/components/Shared/Shimmers/DiscussShimmer.scss';

const DiscussShimmer = () => (
	<div className="discuss-shimmer-wrapper">
		{Array(20).fill(0).map((_, i) => (
			<div className="discuss-shimmer-container" key={i}>
				<div className="discuss-content-placeholder">
					<div className="post-line medium" />
					<div className="post-line short" />
					<div className="post-tags">
						<div className="post-line tag tag1" />
						<div className="post-line tag tag2" />
						<div className="post-line tag tag3" />
					</div>
				</div>
				<div className="date-container">
					<div className="post-line discuss-date-post-line" />
				</div>
				<div className="discuss-shimmer-shimmer" />
			</div>
		))}
	</div>
);

export default DiscussShimmer;
