import React from 'react';
import {
	VictoryBar,
	VictoryAxis,
	VictoryStack,
	VictoryChart,
	VictoryLabel,
} from 'victory';
import { ChallengeColors } from 'constants/ChartColors';

// i18next
import { translate } from 'react-i18next';

const createChartData = (contests, courseID, dataKey) => {
	const filteredContests =
	courseID ? contests.filter(currentContest => currentContest.courseID === courseID) : contests;
	const relevantContests = filteredContests.length > 15 ?
		filteredContests.slice(filteredContests.length - 15) : filteredContests;
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

const PerformanceText = ({ x, y, t }) => (
	<text style={{ fontSize: 20 }} x={x} y={y}>{t('skills.challenge-daily-performance')}</text>
);

const BarChart = ({ t, courseID, contestHistory }) => (
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
		<PerformanceText t={t} x={550} y={300}>{t('skills.challenge-daily-performance')}</PerformanceText>
	</VictoryChart>
);

export default translate()(BarChart);
