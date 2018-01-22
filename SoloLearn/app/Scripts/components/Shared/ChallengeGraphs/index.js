import React from 'react';
import {
	VictoryPie,
	VictoryContainer,
	VictoryChart,
	VictoryTheme,
	VictoryLegend,
} from 'victory';
import 'styles/challengeGraphs.scss';
import PieChart from './PieChart';
import BarChart from './BarChart';

const ChallengeGraphs = ({ contestStats, contestHistory, courseID }) => (
	<div className="challenge-container">
		<PieChart
			courseID={courseID}
			contestStats={contestStats}
		/>
		<BarChart
			courseID={courseID}
			contestHistory={contestHistory}
		/>
	</div>
);

export default ChallengeGraphs;
