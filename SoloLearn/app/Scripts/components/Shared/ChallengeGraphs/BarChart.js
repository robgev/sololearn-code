import React from 'react';
import {
	VictoryBar,
	VictoryAxis,
	VictoryStack,
	VictoryChart,
	VictoryLabel,
} from 'victory';
import { ChallengeColors } from 'constants/ChartColors';

const createChartData = (contests, courseID, dataKey) => {
	const filteredContests =
	courseID ? contests.filter(currentContest => currentContest.courseID === courseID) : contests;
	const relevantContests = filteredContests.slice(filteredContests.length - 15);
	// We will show only 15 of contests and we get like > 60
	return relevantContests.map((currentContest, index) => ({
		x: index + 1,
		y: dataKey === 'loses' ? -currentContest[dataKey] : currentContest[dataKey],
	}));
};

const CustomLabel = props => (
	<VictoryLabel
		{...props}
		text={Math.abs(props.datum.y) || null}
	/>
);

const BarChart = ({ courseID, contestHistory }) => (
	<VictoryChart
		width={800}
		height={300}
		style={{
			parent: {
				height: 300,
			},
		}}
	>
		<VictoryStack
			domain={{ x: [ 0, 16 ], y: [ -10, 10 ] }}
			domainPadding={{ x: -27 }}
		>
			<VictoryBar
				labels={d => d.y}
				labelComponent={<CustomLabel />}
				style={{ data: { fill: ChallengeColors.wins, width: 40 } }}
				data={createChartData(contestHistory, courseID, 'wins')}
			/>
			<VictoryBar
				labels={d => d.y}
				labelComponent={<CustomLabel />}
				style={{ data: { fill: ChallengeColors.loses, width: 40 } }}
				data={createChartData(contestHistory, courseID, 'loses')}
			/>
		</VictoryStack>
		<VictoryAxis
			offsetY={150}
			style={{
				axis: { stroke: 'grey' },
				tickLabels: { display: 'none' },
			}}
		/>
		<VictoryAxis
			dependentAxis
			style={{
				axis: { stroke: '#756F6A' },
				axisLabel: { fontSize: 0, padding: 30 },
				grid: { stroke: 'grey' },
				tickLabels: { display: 'none' },
			}}
		/>
		<text x={600} y={300}>Daily Performance</text>
	</VictoryChart>
);

export default BarChart;
