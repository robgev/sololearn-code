import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Radium, { StyleRoot } from 'radium';
import { fadeInUp } from 'react-animations';

import Service from 'api/service';
import contestTypes from 'defaults/contestTypes';

import SingleResult from './SingleResult';
import TypeSelector from './TypeSelector';
import Start from './Start';
import Result from './Result';
import Timer from './Timer';
import ViewCorrectAnswers from './ViewCorrectAnswers';
import { getTime } from './challenge.utils';

const styles = {
	animate: animation => ({
		animation: '750ms',
		animationName: Radium.keyframes(animation, animation.name),
	}),
};

class Game extends Component {
	constructor(props) {
		super(props);
		const step = props.contest.player.results.length;
		const expired = props.contest.player.result === contestTypes.Expired;
		this.state = {
			step,
			start: true,
			end: step >= 5 || expired,
			viewCorrectAnswers: false,
			// result = 0 don't show result page
			// result = 1 show result page Round {next}
			// result = 2 show result page Correct
			// result = 3 show result page Wrong
			result: 0,
			eventActive: false,
		};
	}
	componentWillUnmount() {
		if (!this.state.start && !this.state.end) {
			this.leave();
		}
		this.removeCloseWindowEvent();
	}
	// Show Correct or Wrong on screen and send the result to the server
	showResult = (result) => {
		this.setState({ result });
		this.pushContest(result === 2);
		setTimeout(() => {
			this.nextStep();
		}, 1500);
	}

	nextStep = () => {
		this.closeWindowEvent();
		const step = this.state.step + 1;
		if (this.state.start) {
			return this.setState({ start: false, result: 1 }, () =>
				setTimeout(() => this.setState({ result: 0 }), 1500));
		}
		if (step < 5) {
			this.closeWindowEvent();
			return this.setState({ step, result: 1 }, () =>
				setTimeout(() => this.setState({ result: 0 }), 1500));
		}
		this.removeCloseWindowEvent();
		// await this.props.updateContest();
		return this.setState({ result: 0, end: true });
	}
	
	goToViewCorrectAnswers = () => {
		this.setState({ viewCorrectAnswers: true, end: false })
	}

	backToResults = () => {
		this.setState({ viewCorrectAnswers: false, end: true })
	}

	declineContest = () => {
		const { id } = this.props.contest;
		browserHistory.push('/contests/');
		Service.request('Challenge/DeclineContest', { id });
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
		if (!this.state.eventActive) {
			window.addEventListener('beforeunload', this.leave);
		}
	}
	removeCloseWindowEvent = () => {
		if (this.state.eventActive) {
			window.removeEventListener('beforeunload', this.leave);
		}
	}
	renderEnd = () => (
		<Result
			contest={this.props.contest}
			courseName={this.props.courseName}
			leave={() => browserHistory.push('/contests')}
			update={this.props.updateContest}
			goToViewCorrectAnswers={this.goToViewCorrectAnswers}
		/>
	)
	renderStart = () => (
		<Start
			contest={this.props.contest}
			courseName={this.props.courseName}
			next={this.nextStep}
			decline={this.declineContest}
			isDeclinable={this.props.contest.player.status === contestTypes.GotChallenged}
		/>)
	renderCorrectAnswers = () => (
		<ViewCorrectAnswers
			contest={this.props.contest}
			courseName={this.props.courseName}
			leave={() => browserHistory.push('/contests')}
			updateContest={this.props.updateContest}
			backToResults={this.backToResults}
		/>
	);
	render() {
		const message = this.state.result === 1 ? `Round ${this.state.step + 1}` :
			(this.state.result === 2 ? 'Correct' : 'Wrong');
		const { contest } = this.props;
		const { step } = this.state;
		if (this.state.result !== 0) {
			return <SingleResult message={message} status={this.state.result} />;
		}
		if (this.state.viewCorrectAnswers) return this.renderCorrectAnswers();
		else if (this.state.end) return this.renderEnd();
		else if (this.state.start) return this.renderStart();
		return (
			<StyleRoot>
				<Timer onTimerEnd={this.showResult} time={getTime(contest, step)} />
				<div style={styles.animate(fadeInUp)}>
					<TypeSelector
						showResult={this.showResult}
						quiz={contest.challenges[step]}
					/>
				</div>
			</StyleRoot>
		);
	}
}

export default Radium(Game);
