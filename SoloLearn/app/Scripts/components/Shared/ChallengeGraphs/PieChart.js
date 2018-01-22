import React from 'react';
import {
	VictoryPie,
	VictoryLegend,
} from 'victory';
import { ChallengeColors } from 'constants/ChartColors';

// For more info on redce see MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
const createChartData = (stats, courseID) => {
	if (courseID) {
		const { wins, loses, draws } =
			stats.find(currentStat => currentStat.courseID === courseID);
		return [
			{ x: 1, y: loses },
			{ x: 2, y: wins },
			{ x: 3, y: draws },
		];
	}
	return stats.reduce((accumulator, currentStat) => ([
		{ ...accumulator[0], y: accumulator[0].y + currentStat.loses },
		{ ...accumulator[1], y: accumulator[1].y + currentStat.wins },
		{ ...accumulator[2], y: accumulator[2].y + currentStat.draws },
	]), [
		{ x: 1, y: 0, fill: ChallengeColors.lost },
		{ x: 2, y: 0, fill: ChallengeColors.wins },
		{ x: 3, y: 0, fill: ChallengeColors.draws },
	]);
};

const PieChart = ({ contestStats, courseID }) => (
	<svg
		role="img"
		width={400}
		height={300}
		viewBox="0 0 400 400"
		style={{
			pointerEvents: 'all',
		}}
		aria-labelledby="victory-container-2-title victory-container-2-desc"
	>
		<VictoryPie
			data={createChartData(contestStats, courseID)}
			style={{
				parent: {
					height: 600,
					marginTop: -100,
					marginBottom: -100,
				},
				labels: {
					fill: 'white',
					fontWeight: 'bold',
				},
			}}
			padAngle={2}
			labels={d => d.y}
			startAngle={135}
			endAngle={135 + 360}
			standalone={false}
			innerRadius={100}
			labelRadius={120}
			sortOrder="descending"
		/>
		<VictoryLegend
			x={10}
			y={375}
			gutter={20}
			symbolSpacer={5}
			standalone={false}
			orientation="horizontal"
			data={[
				{ name: 'Won', symbol: { fill: ChallengeColors.wins, type: 'square' } },
				{ name: 'Draw', symbol: { fill: ChallengeColors.draws, type: 'square' } },
				{ name: 'Lost', symbol: { fill: ChallengeColors.loses, type: 'square' } },
			]}
		/>
		<circle cx={200} cy={200} r={105} fill="rgba(255, 255, 255, 0.3)" />
	</svg>
);

export default PieChart;
