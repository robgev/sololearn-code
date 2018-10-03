/* ***************************************************************************
		 We have the datum.y which shows how much from 100 the current point has.
		 This is basically our radius. Also, we know that there are 5 categories so every
		 Section allocates 360 / 5 = 72 degrees of the circle. As we want our points at the
		 middle, we will start from 36 degrees and add 72 for every next one.
		 This angle is used to find X and Y based on current data point value (i.e. radius)
		 6 * PI / 5 is added because of the line 24 in index js where we "rotate" the
		 Component by 144 degrees (Okaaay, it's 142, put 144 see what happens and
		 try to fix it ffs :D ) The additional 72 is added to start from the right place
*************************************************************************** */

import React from 'react';
import Line from './Line';

const calculateCoordsByIndex = (targetRadius, index) => {
	const ORIGIN_X = 100;
	const ORIGIN_Y = 150;
	const START_ANGLE = (6 * Math.PI) / 5; // 144 + 72 degrees
	const ANGLE_STEP = (2 * Math.PI) / 5; // 72 degrees
	const angle = START_ANGLE - (ANGLE_STEP * index);
	const x = ORIGIN_X + (targetRadius * Math.cos(angle));
	const y = ORIGIN_Y + (targetRadius * Math.sin(angle));
	return { x, y };
};

const CustomLabel = ({
	text, datum, scale, dx, dy,
}) => {
	const LINE_LENGTH = 100;
	// The first two item have another direction, so we check if the index is smaller
	// than 2 and assign direction value based on result -> -1 for left and 1 for right;
	// This is done to make future calculations easier, like x coord of the text,
	// Or some other elements in Line component
	const direction = datum.x < 2 ? -1 : 1;
	const lineLabelRadius = scale.y(datum.y - 10);
	const percentageLabelRadius = scale.y(datum.y - 25);
	const LineCoords = calculateCoordsByIndex(lineLabelRadius, datum.x);
	const PercentageCoords = calculateCoordsByIndex(percentageLabelRadius, datum.x);

	return (
		<g style={{ pointerEvents: 'none' }}>
			<Line direction={direction} length={LINE_LENGTH} x={LineCoords.x} y={LineCoords.y} />
			<text
				fill="white"
				fontSize={5}
				x={PercentageCoords.x}
				y={PercentageCoords.y}
				textAnchor={direction === -1 ? 'start' : 'end'}
			>
				{Math.floor(datum.percentage * 100)}%
			</text>
			<text
				dx={dx}
				dy={dy}
				y={LineCoords.y - 2}
				fontSize={10}
				x={LineCoords.x + (direction * LINE_LENGTH)}
				textAnchor={direction === -1 ? 'start' : 'end'}
			>
				{text.toUpperCase()}
			</text>
		</g>
	);
};

export default CustomLabel;
