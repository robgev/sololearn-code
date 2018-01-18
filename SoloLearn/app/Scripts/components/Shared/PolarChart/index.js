import React from 'react';
import {
	VictoryBar,
	VictoryChart,
	VictoryTheme,
	VictoryPolarAxis,
} from 'victory';
import CompassCenter from './PolarCenter';
import CutsomLabel from './LabelComponent';

const PolarChart = ({ chartData }) => (
	<VictoryChart
		polar
		width={200}
		height={300}
		style={{
			parent: {
				height: 600,
				marginTop: -100,
				marginBottom: -100,
			},
		}}
		startAngle={142}
		endAngle={142 + 360}
		className="chart-parent"
		theme={VictoryTheme.material}
		domain={{ x: [ 0, 5 ], y: [ 0, 100 ] }}
	>
		<VictoryBar
			data={chartData}
			labelComponent={
				<CutsomLabel />
			}
		/>
		<VictoryPolarAxis
			style={{
				axis: { stroke: 'none' },
				tickLabels: { fill: 'none' },
				grid: { stroke: 'none' },
			}}
		/>
		<CompassCenter />
	</VictoryChart>
);

export default PolarChart;
