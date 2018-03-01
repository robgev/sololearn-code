import React from 'react';
import 'styles/components/Shared/Shimmers/FeedShimmer.scss';

const FeedShimmer = () => {
	const renderContainers = Array(4).fill(0).map((_, i) => {
		if (i % 2 === 0) {
			return (
				<div
					key={i}
					className='feed-shimmer-small-container'
				/>
			)
		} else {
			return (
				<div
					key={i}
					className='feed-shimmer-medium-container'
				/>
			)
		}
	});
	return(
		<div>
			<div className='feed-shimmer-title'></div>
			{renderContainers}
		</div>
)}

export default FeedShimmer
