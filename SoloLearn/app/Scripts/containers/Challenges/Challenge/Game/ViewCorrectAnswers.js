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
import SwipeableViews from 'react-swipeable-views';
import { Tabs, Tab } from 'material-ui/Tabs';
import { green500, red500, blue500 } from 'material-ui/styles/colors';
import 'styles/Challenges/Challenge/Game/ViewCorrectAnswers.scss';
import { QuizComponents, QuizType } from 'containers/Learn/QuizSelector';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import TypeSelector from './TypeSelector';
import { createAnswerUI } from './gameUtil';

const styles = {
	animate: animation => ({
		animation: '750ms',
		animationName: Radium.keyframes(animation, animation.name),
	}),
};

class ViewCorrectAnswers extends Component {
	state = {
		updated: false,
		quizNumber: 0
	}
	componentDidMount() {
		this.props.updateContest()
			.then(() => this.setState({ updated: true }));
	}
	handleTabChange(i) {
		this.setState({quizNumber: i})
	}
	render() {
		if (!this.state.updated) {
			return <LoadingOverlay />;
		}
		const playerProfles = ['player', 'opponent'].map((playerProf) => {
			const {
				contest: {
					[playerProf]: {
						name,
						avatarUrl,
						results
					}
				}
			} = this.props;
			// a workaround for a case when one player finished all the questions
			// while another one finished only 3 or smth
			let newResults = null;
			if (results.length < 5) {
				const numberOfItemsToAdd = 5 - results.length;
				const itemsToAdd = Array(numberOfItemsToAdd).fill(undefined).map((_, id) => ({id, isCompleted: false}));
				newResults = [...results, ...itemsToAdd];
			}
			return {
				name,
				avatarUrl,
				results: newResults || results,
			}
		});
		const createQuizTabs = Array(5).fill(undefined).map((_, i) => {
			return (
				<Tab
					value={i}
					label={i + 1}
					key={i}
					onClick={() => this.handleTabChange(i)}
				/>
			)
		});
		const playersUI = playerProfles.map(player => {
			const { name, avatarUrl, results } = player;
			const { quizNumber } = this.state;
			const { id, isCompleted } = results[quizNumber];
			return (
				<div key={player.name} className='player-ui-wrapper'>
					{
						avatarUrl &&
						<img src={avatarUrl}/>
					}
					<div className='player-ui-info'>
						<div>{name}</div>
						<div className='player-ui-quiz-result'>
							<div>{createAnswerUI({id, isCompleted})}</div>
							<div>{isCompleted ? 'Correct' : 'Wrong'}</div>
						</div>
					</div>
				</div>
			)
		})
		const { contest } = this.props;
		const quizes = contest.challenges.slice(0, 5).map(quiz => (
			<TypeSelector
				isShowingCorrectAnswers
				showResult={() => console.log('woop')}
				quiz={quiz}
			/>
		));
		const { quizNumber } = this.state;
		return (
			<div className='container'>
				<Tabs>
					{createQuizTabs}
				</Tabs>
				<div className='players'>
					{playersUI}
				</div>
				<div style={styles.animate(fadeInUp)}>
					<SwipeableViews
						index={quizNumber}
						onChangeIndex={this.handleTabChange}
					>
						{quizes}
					</SwipeableViews>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ levels }) => ({ levels });

export default connect(mapStateToProps)(Radium(ViewCorrectAnswers));
