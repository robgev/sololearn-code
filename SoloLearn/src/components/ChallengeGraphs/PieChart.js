import React from 'react';
import {
	VictoryPie,
	VictoryLegend,
} from 'victory';
import { ChallengeColors } from 'constants/ChartColors';

// i18next
import { translate } from 'react-i18next';

// For more info on reduce see MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
const createChartData = (stats, courseID) => {
	if (courseID) {
		const { wins, loses, draws } =
			stats.find(currentStat => currentStat.courseID === courseID);
		return [
			{ x: 1, y: loses, fill: ChallengeColors.lost },
			{ x: 2, y: wins, fill: ChallengeColors.wins },
			{ x: 3, y: draws, fill: ChallengeColors.draws },
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

// This small function takes data and confirms that there are
// more than 1 pads. It checks in an order if the user has
// losses, wins and draws and adds 1 to accumulator if the user does,
// basically counting the number of pads this way.
// Then checks if there is more than 1 tab
const shouldHavePad = chartData =>
	chartData.reduce((acc, data) => (data.y > 0 ? acc + 1 : acc), 0) > 1;

const PieChart = ({ t, contestStats, courseID }) => {
	const data = createChartData(contestStats, courseID);
	return (
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
				data={data}
				style={{
					parent: {
						height: 600,
						marginTop: -100,
						marginBottom: -100,
					},
					labels: {
						fill: 'white',
						fontWeight: 'bold',
						fontSize:'19px',
					},
				}}
				startAngle={135}
				endAngle={135 + 360}
				standalone={false}
				innerRadius={100}
				labelRadius={120}
				sortOrder="descending"
				labels={d => (d.y > 0 ? d.y : null)}
				padAngle={shouldHavePad(data) ? 2 : 0}
			/>
			<VictoryLegend
				x={10}
				y={375}
				gutter={20}
				symbolSpacer={5}
				standalone={false}
				orientation="horizontal"
				data={[
					{ name: t('skills.challenge-pie-won'), symbol: { fill: ChallengeColors.wins, type: 'square' } },
					{ name: t('skills.challenge-pie-draw'), symbol: { fill: ChallengeColors.draws, type: 'square' } },
					{ name: t('skills.challenge-pie-lost'), symbol: { fill: ChallengeColors.loses, type: 'square' } },
				]}
			/>
			<circle cx={200} cy={200} r={105} fill="rgba(255, 255, 255, 0.3)" />
		</svg>
	);
};

export default translate()(PieChart);
