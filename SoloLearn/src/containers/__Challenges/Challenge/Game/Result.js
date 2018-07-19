// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
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
import ResultPie from 'components/ChallengeGraphs/ResultPie';
import AnimatedNumber from 'components/AnimatedNumber';
import { green500, red500, blue500 } from 'material-ui/styles/colors';
import 'styles/Challenges/Challenge/Game/Result';
import { createAnswerUI } from './gameUtil';
// Material UI components
import { getChallengeStatus } from 'utils';
import contestTypes from 'defaults/contestTypes';
import LoadingOverlay from 'components/LoadingOverlay';

import Profile from './Profile';
import Comment from '../../../Comments/Comment';

// i18next
import { translate } from 'react-i18next';

const XP_ANIMATION_DURATION = 1000;
const XP_ANIMATION_START_IN = 1000;

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
	<div className="result-box">
		<p style={styles.resultTitle(color)}>{aboveText}</p>
		<p style={styles.rewardXp(color)}>{insideText} XP</p>
	</div>
);

const AnimatedResults = ({
	oldPoints,
	newPoints,
	myLevel,
	t,
}) => (
	<div className="chart-container">
		<AnimatedNumber
			fromNumber={oldPoints.untilNextLevelXp}
			toNumber={newPoints.untilNextLevelXp}
			text={`${t('play.result.reach-to-level')} ${myLevel + 1}`}
			animationDuration={XP_ANIMATION_DURATION}
			animationStartIn={XP_ANIMATION_START_IN}
		/>
		<ResultPie
			level={myLevel}
			oldPieResults={[ { y: oldPoints.xp }, { y: oldPoints.untilNextLevelXp } ]}
			newPieResults={[ { y: newPoints.xp }, { y: newPoints.untilNextLevelXp } ]}
			animationDuration={XP_ANIMATION_DURATION}
			startAfter={XP_ANIMATION_START_IN}
		/>
		<AnimatedNumber
			fromNumber={oldPoints.xp}
			toNumber={newPoints.xp}
			text="xp"
			animationDuration={XP_ANIMATION_DURATION}
			animationStartIn={XP_ANIMATION_START_IN}
		/>
	</div>
);

const ResultTable = ({
	myRes,
	opRes,
	t,
}) => {
	const myAnswersUI = myRes.map(createAnswerUI);
	const opAnswersUI = opRes.map(createAnswerUI);
	const questionNumberUI = new Array(5).fill(undefined).map((_, i) => (
		<div key={i}>{i + 1}</div>
	));
	return (
		<div className="result-table-container">
			<div className="answers-column">
				<div>{t('play.result.self-result-title')}</div>
				{myAnswersUI}
			</div>
			<div className="answers-column">
				<div>&nbsp;</div>
				{questionNumberUI}
			</div>
			<div className="answers-column">
				<div>{t('play.result.opponent-result-title')}</div>
				{opAnswersUI}
			</div>
		</div>
	);
};
// TODO: make these props smaller
const Results = ({
	courseName,
	answersBonus,
	matchResult,
	totalXp,
	oldPoints,
	newPoints,
	myLevel,
	myRes,
	opRes,
	t,
}) => (
	<div style={styles.appear(fadeIn)}>
		<p className="language">{courseName.toUpperCase()}</p>
		<div className="result-boxes">
			<ResultBox
				aboveText={t('play.result.answers-bonus')}
				insideText={answersBonus}
				color={blue500}
			/>
			<ResultBox
				aboveText={t('play.result.match-result')}
				insideText={matchResult}
				color={matchResult < 0 ? red500 : green500}
			/>
			<ResultBox
				aboveText={t('play.result.total-xp')}
				insideText={totalXp}
				color={totalXp < 0 ? red500 : green500}
			/>
		</div>
		<div className="result-charts">
			<AnimatedResults {...{
				t,
				myLevel,
				oldPoints,
				newPoints,
			}}
			/>
			<ResultTable {...{
				myRes,
				opRes,
				t,
			}}
			/>
		</div>
	</div>
);

class Result extends Component {
	state = { updated: false }
	componentDidMount() {
		this.props.update()
			.then(() => this.setState({ updated: true }));
		ReactGA.ga('send', 'screenView', { screenName: 'Challenge Result Page' });
	}
	counter = arr => arr.reduce((res, curr) => (curr.isCompleted ? res + 1 : res), 0)

	answerBonusCounter = results => results.reduce((xp, current) => xp + current.earnedXp, 0)
	matchResultCounter = contest =>
		(contest.player.status === 1 ? contest.player.rewardXp : -contest.opponent.rewardXp)
	countUntilNextLevel = (totalXp) => {
		const { player: { level, xp: oldXp } } = this.props.contest;
		const nextLevelXp = this.props.levels[level - 1].maxXp;
		const newXp = oldXp + totalXp;
		const newUntilNextLevelXp = nextLevelXp - newXp;
		const oldUntilNextLevelXp = nextLevelXp - oldXp;
		return {
			oldPoints: { xp: oldXp, untilNextLevelXp: oldUntilNextLevelXp },
			newPoints: { xp: newXp, untilNextLevelXp: newUntilNextLevelXp },
		};
	}
	render() {
		if (!this.state.updated) {
			return <LoadingOverlay />;
		}
		const {
			t, courseName, contest, levels,
		} = this.props;
		const { status } = contest.player;
		const {
			player: {
				results: myRes,
				level: myLevel,
			},
			opponent: {
				results: opRes,
			},
		} = contest;
		const answersBonus = this.answerBonusCounter(myRes);
		const matchResult = this.matchResultCounter(contest);
		const totalXp = answersBonus + matchResult;
		const { oldPoints, newPoints } = this.countUntilNextLevel(totalXp);
		return (
			<div id="challenge-start" className="result-container">
				<div style={styles.appear(fadeInDown)}>
					{status !== contestTypes.GotChallenged && getChallengeStatus(status, styles.status)}
				</div>
				<div className="player-wrapper">
					<div className="player" style={styles.appear(fadeInLeft)}>
						<Profile player={contest.player} />
					</div>
					<span className="versus">{this.counter(myRes)} : {this.counter(opRes)}</span>
					<div className="player" style={styles.appear(fadeInRight)}>
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
							oldPoints,
							newPoints,
							myLevel,
							myRes,
							opRes,
							t,
						}}
					/>
				}
				<div style={styles.appear(fadeInUp)}>
					<RaisedButton
						label="Leave"
						className="button"
						secondary
						onClick={this.props.leave}
					/>
					{
						(status === 1 || status === 2 || status === 8) &&
						<RaisedButton
							label={t('play.result.view-correct-answers')}
							className="button"
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

const translatedResult = translate()(Radium(Result));

export default connect(mapStateToProps)(translatedResult);
