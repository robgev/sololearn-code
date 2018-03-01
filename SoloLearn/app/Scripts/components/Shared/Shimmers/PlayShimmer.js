import React from 'react';
import 'styles/components/Shared/Shimmers/PlayShimmer.scss';

const PlayShimmer = () => {
	const renderContainers = Array(10).fill(0).map((_, i) => {
		return (
			<div className='play-shimmer-container' key={i}/>
		)
});
	return(
		<div>
			<div className='play-shimmer-title'></div>
			{renderContainers}
		</div>
)}

export default PlayShimmer
