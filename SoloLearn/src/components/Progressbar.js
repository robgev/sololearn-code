import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

const Progressbar = ({ percentage, style }) => (
	<CircularProgressbar
		strokeWidth={3}
		styles={{
			root: { position: 'absolute', width: '110%', ...style },
			path: { stroke: '#9CCC65' },
			trail: { stroke: '#DCDCDE' },
		}}
		percentage={percentage}
	/>
);

export default Progressbar;
