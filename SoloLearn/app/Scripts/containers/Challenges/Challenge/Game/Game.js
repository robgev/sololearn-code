import React, { Component } from 'react';
import Start from './Start';
import Result from './Result';
import RaisedButton from 'material-ui/RaisedButton';
import TypeSelector from './TypeSelector';
import QuizText from '../../../Learn/QuizText';
import { browserHistory } from 'react-router';
import Service from '../../../../api/service';
import SingleResult from './SingleResult';
import contestTypes from '../../../../defaults/contestTypes';
import Radium, { StyleRoot } from 'radium';
import { fadeInUp } from 'react-animations';

const styles = {
    animate: (animation) => {
        return {
            animation: '750ms',
            animationName: Radium.keyframes(animation, animation.name)
        }
    },
}

class Game extends Component {
    constructor(props) {
        super(props);
        const step = this.props.contest.player.results.length;
        this.state = {
            step,
            start: true,
            end: step >= 5,
            // result = 0 don't show result page
            // result = 1 show result page Round {next}
            // result = 2 show result page Correct
            // result = 3 show result page Wrong
            result: 0,
            eventActive: false
        }
    }

    // Show Correct or Wrong on screen and send the result to the server
    showResult = result => {
        this.setState({ result });
        this.pushContest(result == 2);
        setTimeout(() => {
            this.nextStep();
        }, 1500);
    }

    nextStep = () => {
        this.closeWindowEvent();
        if(this.state.start) {
            return this.setState({ start: false, result: 1 }, () =>
                setTimeout(() => this.setState({ result: 0 }), 1500));
        }
        const step = this.state.step + 1;
        if(step < 5) {
            this.closeWindowEvent();
            return this.setState({ step, result: 1 }, () =>
                setTimeout(() => this.setState({ result: 0 }), 1500));
        } else {
            this.removeCloseWindowEvent();
            // await this.props.updateContest();
            return this.setState({ result: 0, end: true });
        }
    }

    declineContest = () => {
        const { id } = this.props.contest;
        return Service
            .request('Challenge/DeclineContest', { id })
            .then(() => browserHistory.push('/contests/'))
            .catch(e => console.log(e));
    }
    pushContest = (isCompleted) => {
        const { id: contestId } = this.props.contest;
        const challengeId = this.props.contest.challenges[this.state.step].id;
        return Service
            .request('Challenge/PushContestResult', { contestId, challengeId, isCompleted })
            .catch(e => console.log(e));
    }
    leave = () => {
        this.pushContest(false);
    }
    closeWindowEvent = () => {
        if(!this.state.eventActive) {
            window.addEventListener('beforeunload', this.leave);
        }
    }
    removeCloseWindowEvent = () => {
        if(this.state.eventActive) {
            window.removeEventListener('beforeunload', this.leave);
        }
    }
    componentWillUnmount() {
        if(!this.state.start && !this.state.end){
            this.leave();
        }
        this.removeCloseWindowEvent();
    }
    renderEnd = () => {
        return (
            <Result
                contest={this.props.contest}
                courseName={this.props.courseName}
                leave={() => browserHistory.push('/contests')}
                update={this.props.updateContest}                
            />
        )
    }
    renderStart = () => {
        return (
            <Start
                contest={this.props.contest}
                courseName={this.props.courseName}
                next={this.nextStep}
                decline={this.declineContest}
                isDeclinable={this.props.contest.player.status === contestTypes.GotChallenged}
            />)
    }
    render() {
        if(this.state.result != 0) {
            const message = this.state.result == 1 ? `Round ${this.state.step + 1}` :
                (this.state.result == 2 ? 'Correct' : 'Wrong');
            return (
                <SingleResult
                    message={message}
                    status={this.state.result}
                />
            )
        }
        const { contest } = this.props;
        const { step } = this.state;
        const CurrentChallenge = () => {
            return (
                <StyleRoot>
                    <div style={styles.animate(fadeInUp)}>
                        <TypeSelector
                            showResult={this.showResult}
                            quiz={contest.challenges[step]}
                        />
                    </div>
                </StyleRoot>);
        } 
        return(
            <div>
                {
                    this.state.end ? this.renderEnd() :
                        this.state.start ? this.renderStart() :
                            <CurrentChallenge />
                }
            </div>
        )
    }
}

export default Radium(Game);