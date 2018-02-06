import React from 'react';
import {
	VictoryPie,
	VictoryLegend,
} from 'victory';
// import { ChallengeColors } from 'constants/ChartColors';
// TODO: find a way to put a word right inside of the circle
const ResultPie = ({level, pieResults}) => (
    <VictoryPie
        style={{
            parent: {
                height: 200
            }
        }}
        labels={(_) => 'a'}
        labelRadius={1}
        innerRadius={100}
        data={pieResults}
    >
        Boi
    </VictoryPie>
    
);

export default ResultPie;
