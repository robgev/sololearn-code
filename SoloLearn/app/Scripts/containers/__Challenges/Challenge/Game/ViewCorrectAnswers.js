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
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import 'styles/Challenges/Challenge/Game/ViewCorrectAnswers.scss';
import Service from 'api/service';
import { QuizComponents, QuizType } from 'containers/Learn/QuizSelector';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import TypeSelector from './TypeSelector';
import { createAnswerUI } from './gameUtil';

// i18next
import { translate } from 'react-i18next';

const styles = {
	animate: animation => ({
		animation: '750ms',
		animationName: Radium.keyframes(animation, animation.name),
	}),
};
const optionsMessages = [
	{
		name: 'Spelling Errors',
		reason: 41,
	},
	{
		name: 'Wrong Question',
		reason: 42,
	},
	{
		name: 'Wrong Answer',
		reason: 43,
	},
	{
		name: 'Off Topic',
		reason: 44,
	},
	{
		name: 'Other',
		reason: 0,
	},
];

class ViewCorrectAnswers extends Component {
	state = {
		updated: false,
		quizNumber: 0,
	}
	componentDidMount() {
		this.props.updateContest()
			.then(() => this.setState({ updated: true }));
		ReactGA.ga('send', 'screenView', { screenName: 'Challenge Round Review Page' });
	}
	handleTabChange(i) {
		this.setState({ quizNumber: i });
	}
	sendReport(itemId, reason) {
		Service.request('ReportItem', {
			itemId,
			itemType: 6, // this is a report type, on the server-side 6 stands for challenge report
			reason, // this is a challenge report type
		})
			.then((response) => {
				console.log(response);
			});
	}
	render() {
		const { t } = this.props;
		if (!this.state.updated) {
			return <LoadingOverlay />;
		}
		const playerProfles = [ 'player', 'opponent' ].map((playerProf) => {
			const {
				contest: {
					[playerProf]: {
						name,
						avatarUrl,
						results,
					},
				},
			} = this.props;
			// a workaround for a case when one player finished all the questions
			// while another one finished only 3 or smth
			let newResults = null;
			if (results.length < 5) {
				const numberOfItemsToAdd = 5 - results.length;
				const itemsToAdd = Array(numberOfItemsToAdd).fill(undefined).map((_, id) => ({ id, isCompleted: false }));
				newResults = [ ...results, ...itemsToAdd ];
			}
			return {
				name,
				avatarUrl,
				results: newResults || results,
			};
		});
		const createQuizTabs = Array(5).fill(undefined).map((_, i) => (
			<Tab
				value={i}
				label={i + 1}
				key={i}
				onClick={() => this.handleTabChange(i)}
			/>
		));
		const playersUI = playerProfles.map((player) => {
			const { name, avatarUrl, results } = player;
			const { quizNumber } = this.state;
			const { id, isCompleted } = results[quizNumber];
			return (
				<div key={player.name} className="player-ui-wrapper">
					{
						avatarUrl &&
						<img src={avatarUrl} />
					}
					<div className="player-ui-info">
						<div>{name}</div>
						<div className="player-ui-quiz-result">
							<div>{createAnswerUI({ id, isCompleted })}</div>
							<div>{isCompleted ? t('play.answers.correct-answer') : t('play.answers.wrong-answer')}</div>
						</div>
					</div>
				</div>
			);
		});
		const { contest } = this.props;

		const menuIcons = quizId => optionsMessages.map((opt, i) => (
			<MenuItem
				key={i}
				primaryText={opt.name}
				onClick={this.sendReport.bind(null, quizId, opt.reason)}
			/>
		));
		const quizes = contest.challenges.slice(0, 5).map(quiz => (
			<div key={quiz.id}>
				<div className="players">
					{playersUI}
				</div>
				<div className="options-icon-wrapper">
					<IconMenu
						style={{ width: 40, height: 40 }}
						iconButtonElement={<IconButton><MoreVertIcon color="black" /></IconButton>}
					>
						{menuIcons(quiz.id)}
					</IconMenu>
				</div>
				<TypeSelector
					isShowingCorrectAnswers
					showResult={() => console.log('woop')}
					quiz={quiz}
				/>
			</div>
		));
		const { quizNumber } = this.state;
		return (
			<div className="correct-answers-container">
				<Tabs>
					{createQuizTabs}
				</Tabs>
				<div className="back-to-results-button">
					<RaisedButton
						label="Back to Results"
						secondary
						onClick={this.props.backToResults}
					/>
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

export default connect(mapStateToProps)(translate()(Radium(ViewCorrectAnswers)));
