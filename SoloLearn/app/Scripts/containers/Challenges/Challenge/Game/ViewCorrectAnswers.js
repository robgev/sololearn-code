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
import { Tabs, Tab } from 'material-ui/Tabs';
import { green500, red500, blue500 } from 'material-ui/styles/colors';
import { QuizComponents, QuizType } from 'containers/Learn/QuizSelector';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import TypeSelector from './TypeSelector';
import { createAnswerUI } from './gameUtil';

const styles = {
	container: {
		padding: '20px 0 0 0',
		textAlign: 'center',
	},
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
			return {
				name,
				avatarUrl,
				results
			}
		});
		const createQuizTabs = Array(5).fill(undefined).map((_, i) => {
			return (
				<Tab
					value={i}
					label={i + 1}
					key={i}
					onClick={() => this.setState({quizNumber: i})}
				/>
			)
		});
		const playersUI = playerProfles.map(player => {
			const { name, avatarUrl } = player;
			return (
				<div key={player.name} style={{display: 'flex', flexDirection: 'row'}}>
					{
						avatarUrl &&
						<img src={avatarUrl}/>
					}
					<div style={{display: 'flex', flexDirection: 'column'}}>
						<div>{name}</div>
						<div>Wrong</div>
					</div>
				</div>
			)
		})
		const { contest } = this.props;
		const quiz = contest.challenges[this.state.quizNumber];
		const QuizComponent = QuizComponents[quiz.type];
		// TODO: add preselected buttons
		return (
			<div id="challenge-start" style={styles.container}>
				<Tabs>
					{createQuizTabs}
				</Tabs>
				<div className='players' style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					backgroundColor: '#eff5ff',
					margin: 50,
					padding: 20
				}}>
				
					{playersUI}
				</div>
				<div style={styles.animate(fadeInUp)}>
					<TypeSelector
						showResult={() => console.log('woop')}
						quiz={quiz}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ levels }) => ({ levels });

export default connect(mapStateToProps)(Radium(ViewCorrectAnswers));
