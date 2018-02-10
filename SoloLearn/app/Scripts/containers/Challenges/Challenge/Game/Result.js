// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import {
	fadeIn,
	fadeInUp,
	fadeInLeft,
	fadeInDown,
	fadeInRight,
} from 'react-animations';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import ResultPie from 'components/Shared/ChallengeGraphs/ResultPie';
import { green500, red500, blue500 } from 'material-ui/styles/colors';
import 'styles/Challenges/Challenge/Game/Result';
import { createAnswerUI } from './gameUtil';
// Material UI components
import { getChallengeStatus } from 'utils';
import contestTypes from 'defaults/contestTypes';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

import Profile from './Profile';

const styles = {
	status: {
		display: 'inline-block',
		width: 120,
		fontSize: 14,
		fontWeight: 500,
		padding: 5,
		textAlign: 'center',
	},

	resultTitle: color => ({
		color,
		fontWeight: 500,
		margin: '0 0 5px 0',
	}),

	rewardXp: color => ({
		width: '95px',
		padding: '3px',
		border: `2px solid ${color}`,
		color,
		fontWeight: 500,
	}),

	appear: animation => ({
		animation: '750ms',
		animationName: Radium.keyframes(animation, animation.name),
	}),
};

const ResultBox = ({ aboveText, insideText, color }) => (
	<div className='result-box'>
		<p style={styles.resultTitle(color)}>{aboveText}</p>
		<p style={styles.rewardXp(color)}>{insideText} XP</p>
	</div>
);

const ResultTable = ({
	myRes,
	opRes
}) => {
	const myAnswersUI = myRes.map(createAnswerUI);
	const opAnswersUI = opRes.map(createAnswerUI);
	const questionNumberUI = new Array(5).fill(undefined).map((_, i) => (
		<div key={i}>{i + 1}</div>
	));
	return (
		<div className='result-table-container'>
			<div className='answers-column'>
				<div>YOU</div>
				{myAnswersUI}
			</div>
			<div className='answers-column'>
				<div>&nbsp;</div>
				{questionNumberUI}
			</div>
			<div className='answers-column'>
				<div>OPPONENT</div>
				{opAnswersUI}
			</div>
		</div>
)};
// TODO: make these props smaller
const Results = ({
	courseName,
	answersBonus,
	matchResult,
	totalXp,
	untilNextLevelXp,
	percUntilNext,
	myXp,
	myLevel,
	myRes,
	opRes
}) => (
	<div style={styles.appear(fadeIn)}>
		<p className='language'>{courseName.toUpperCase()}</p>
		<div className='result-boxes'>
			<ResultBox
				aboveText="ANSWERS BONUS"
				insideText={answersBonus}
				color={blue500}
			/>
			<ResultBox
				aboveText="MATCH RESULT"
				insideText={matchResult}
				color={matchResult < 0 ? red500 : green500}
			/>
			<ResultBox
				aboveText="TOTAL XP"
				insideText={totalXp}
				color={totalXp < 0 ? red500 : green500}
			/>
		</div>
		<div className='result-charts'>
			<div className='chart-container'>
				<div>
					{untilNextLevelXp}XP to Level {myLevel + 1}
				</div>
				<ResultPie level={myLevel} pieResults={[{ y: myXp }, { y: untilNextLevelXp }]} />
				<div>
					{myXp}XP
				</div>
			</div>
			<ResultTable myRes={myRes} opRes={opRes} />
		</div>
	</div>
);

class Result extends Component {
	state = { updated: false }
	componentDidMount() {
		this.props.update()
			.then(() => this.setState({ updated: true }));
	}
	counter = arr => arr.reduce((res, curr) => (curr.isCompleted ? res + 1 : res), 0)

	answerBonusCounter = results => results.reduce((xp, current) => xp + current.earnedXp, 0)
	matchResultCounter = contest =>
		(contest.player.status === 1 ? contest.player.rewardXp : -contest.opponent.rewardXp)
	countUntilNextLevel = (totalXp) => {
		const { player: { level, xp } } = this.props.contest;
		const newXp = xp + totalXp;
		const nextLevelXp = this.props.levels[level - 1].maxXp;
		const untilNextLevelXp = nextLevelXp - newXp;
		const percentage = 100 - (100 * (untilNextLevelXp / nextLevelXp));
		return [ untilNextLevelXp, percentage ];
	}
	render() {
		if (!this.state.updated) {
			return <LoadingOverlay />;
		}
		const { courseName, contest } = this.props;
		const { status } = contest.player;
		const {
			player: {
				results: myRes,
				xp: myXp,
				level: myLevel
			},
			opponent: {
				results: opRes
			}
		} = contest;
		const answersBonus = this.answerBonusCounter(myRes);
		const matchResult = this.matchResultCounter(contest);
		const totalXp = answersBonus + matchResult;
		const [ untilNextLevelXp, percUntilNext ] = this.countUntilNextLevel(totalXp);
		return (
			<div id="challenge-start" className='container'>
				<div style={styles.appear(fadeInDown)}>
					{status !== contestTypes.GotChallenged && getChallengeStatus(status, styles.status)}
				</div>
				<div className='player-wrapper'>
					<div className='player' style={styles.appear(fadeInLeft) }>
						<Profile player={contest.player} />
					</div>
					<span className='versus'>{this.counter(myRes)} : {this.counter(opRes)}</span>
					<div className='player' style={styles.appear(fadeInRight)}>
						<Profile player={contest.opponent} />
					</div>
				</div>
				{
					// TODO: make these props smaller
					(status === 1 || status === 2 || status === 8) &&
					<Results
						{...{
							courseName,
							answersBonus,
							matchResult,
							totalXp,
							untilNextLevelXp,
							percUntilNext,
							myXp,
							myLevel,
							myRes,
							opRes
						}}
					/>
				}
				<div style={styles.appear(fadeInUp)}>
					<RaisedButton
						label="Leave"
						className='button'
						secondary
						onClick={this.props.leave}
					/>
					{
						(status === 1 || status === 2 || status === 8) &&
						<RaisedButton
							label="View Correct Answers"
							className='button'
							secondary
							onClick={this.props.goToViewCorrectAnswers}
						/>
					}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ levels }) => ({ levels });

export default connect(mapStateToProps)(Radium(Result));
