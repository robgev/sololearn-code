import React from 'react';

const Line = ({
	x,
	y,
	length,
	direction,
}) => (
	<g>
		<circle r={1} cx={x} cy={y} />
		<line
			x1={x}
			y1={y}
			y2={y}
			x2={x + (length * direction)}
			strokeWidth={1}
			stroke="black"
		/>
	</g>
);

export default Line;
