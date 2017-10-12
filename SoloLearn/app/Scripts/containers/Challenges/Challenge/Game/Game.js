import React, { PureComponent } from 'react';
import Start from './Start';
import RaisedButton from 'material-ui/RaisedButton';
import TypeSelector from './TypeSelector';
import QuizText from '../../../Learn/QuizText';
import { browserHistory } from 'react-router';
import Service from '../../../../api/service';
import SingleResult from './SingleResult';

class Game extends PureComponent {
    state = {
        step: -1,

        // result = 0 don't show result page
        // result = 1 show result page Round {next}
        // result = 2 show result page Correct
        // result = 3 show result page Wrong
        result: 0
    }

    // Show Correct or Wrong on screen for 2 seconds and send the result to the server
    showResult = result => {
        this.setState({ result });
        setTimeout(() => {
            this.pushContest(result == 2);
            this.nextStep();
            this.setState({ result: 1 }, () => 
                setTimeout(() => this.setState({ result: 0 }), 2000));
        }, 2000);
    }

    nextStep = () => {
        const step = this.state.step + 1;
        if(step > -1 && step < 5) {
            this.closeWindowEvent();
            this.setState({ step, result: 1 }, () =>
                setTimeout(() => this.setState({ result: 0 }), 2000));
        } else {
            this.setState({ step });
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
        window.addEventListener('beforeunload', this.leave);
    }
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.leave);
    }
    renderStart = () => {
        return (
        <Start
            contest={this.props.contest}
            courseName={this.props.courseName}
            next={this.nextStep}
            decline={this.declineContest}
        />)
    }
    isQuestion = () => this.state.step > -1 && this.state.step < 5;
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
        const CurrentChallenge = this.isQuestion() ? (
            <div>
                <QuizText textContent={contest.challenges[step].question} />
                <TypeSelector
                    showResult={this.showResult}
                    quiz={this.props.contest.challenges[this.state.step]}
                />
            </div>) : null;
        return(
            <div>
                {this.state.step === -1 ? this.renderStart() : null}
                {CurrentChallenge}
            </div>
        )
    }
}

export default Game;