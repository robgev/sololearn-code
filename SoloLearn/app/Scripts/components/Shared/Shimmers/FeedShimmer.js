import React from 'react';
import 'styles/components/Shared/Shimmers/FeedShimmer.scss';

const FeedShimmer = () => {
	const renderContainers = Array(4).fill(0).map((_, i) => (
		<div
			key={i}
			className={
				i % 2 === 0 ?
				'feed-shimmer-small-container' :
				'feed-shimmer-medium-container'
			}
		/>
	));
	return(
		<div>
			<div className='feed-shimmer-title'></div>
			{renderContainers}
		</div>
)}

export default FeedShimmer
