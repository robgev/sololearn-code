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
            pieResults: props.oldPieResults
        }
    }

    componentDidMount() {
        const { startAfter } = this.props;
        setTimeout(this.addTotalContestXp, startAfter);
    }

    addTotalContestXp = () => {
        const { newPieResults } = this.props;
        this.setState({ pieResults: newPieResults });
    }

    render() {
        const { level, animationDuration } = this.props;
        const { pieResults } = this.state;
        return (
            <div className='pie-chart-wrapper'>
                <div className='level'>
                    <div>LEVEL</div>
                    <div>{level}</div>
                </div>
                <VictoryPie
                    animate={{ duration: animationDuration }}
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
