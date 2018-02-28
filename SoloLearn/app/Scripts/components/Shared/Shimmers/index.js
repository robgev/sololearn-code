import React from 'react';
import 'styles/components/Shared/Shimmers/index.scss';

const Shimmer = ({children}) => {
	return (
		<div className='shimmer-container'>
			{children}
		</div>
	)
}

export default Shimmer;
