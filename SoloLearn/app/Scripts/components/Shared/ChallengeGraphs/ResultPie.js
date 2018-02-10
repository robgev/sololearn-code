import React from 'react';
import {
	VictoryPie,
	VictoryLegend,
} from 'victory';
import 'styles/components/Shared/ChallengeGraphs/ResultPie';
// import { ChallengeColors } from 'constants/ChartColors';
// TODO: find a way to put a word right inside of the circle
class ResultPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pieResults: props.initialPieResults
        }
    }

    componentDidMount() {
        setTimeout(this.addTotalContestXp, 1000);
    }

    addTotalContestXp = () => {
        const { pieResults } = this.state;
        const { addedAmountOfXp } = this.props;
        const [{y: myXp}, {y: untilNextLevelXp}] = pieResults;
        const newMyXp = myXp + addedAmountOfXp;
        const newUntilNextLevelXp = untilNextLevelXp - addedAmountOfXp;
        const newPieResults = [{ y: newMyXp }, { y: newUntilNextLevelXp }];
        this.setState({ pieResults: newPieResults });
    }

    render() {
        const { level, addedAmountOfXp } = this.props;
        const { pieResults } = this.state;
        return (
            <div className='pie-chart-wrapper'>
                <div className='level'>
                    <div>LEVEL</div>
                    <div>{level}</div>
                </div>
                <VictoryPie
                    animate={{ duration: 2000 }}
                    className='pie-chart'
                    style={{
                        parent: {
                            height: 200
                        }
                    }}
                    innerRadius={100}
                    data={pieResults}
                />
            </div>
        )
    }
}

export default ResultPie;
