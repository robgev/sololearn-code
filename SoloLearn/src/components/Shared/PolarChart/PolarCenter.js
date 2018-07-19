import React from 'react';

const CompassCenter = ({ origin }) => (
	<g>
		<circle
			r={7}
			cx={origin.x}
			cy={origin.y}
			style={{
				height: '100%',
				userSelect: 'none',
				width: '100%',
				fill: 'white',
				stroke: 'rgba(255, 255, 255, 0.3)',
				strokeWidth: 3,
			}}
		/>
	</g>
);

export default CompassCenter;
