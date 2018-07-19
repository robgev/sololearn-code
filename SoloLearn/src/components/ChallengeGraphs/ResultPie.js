import React from 'react';
import {
	VictoryPie,
	VictoryLegend,
} from 'victory';
import 'styles/components/ChallengeGraphs/ResultPie';

// i18next
import { translate } from 'react-i18next';

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
        const { t, level, animationDuration } = this.props;
        const { pieResults } = this.state;
        return (
            <div className='pie-chart-wrapper'>
                <div className='level'>
                    <div>{t('play.level')}</div>
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

export default translate()(ResultPie);
