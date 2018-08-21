import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

const Progressbar = ({ percentage }) => (
	<CircularProgressbar
		strokeWidth={3}
		styles={{
			root: { position: 'absolute', width: '110%' },
			path: { stroke: '#9CCC65' },
			trail: { stroke: '#DCDCDE' },
		}}
		percentage={percentage}
	/>
);

export default Progressbar;
