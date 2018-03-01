import React from 'react';
import 'styles/components/Shared/Shimmers/CodeShimmer.scss';

const CodeShimmer = () => {
	const renderContainers = Array(10).fill(0).map((_, i) => {
		return (
			<div className='code-shimmer-container' key={i}/>
		)
	});
	return(
		<div>
			{renderContainers}
		</div>
)}

export default CodeShimmer
