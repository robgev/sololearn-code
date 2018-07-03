import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import { browserHistory } from 'react-router';
import { setSuggestionChallenge } from 'actions/quizFactory';
import Layout from 'components/Layouts/GeneralLayout';
import Quiz, { CheckBar } from 'components/Shared/Quiz';
import LoadingButton from 'components/Shared/LoadingButton';
import SuggestMultipleChoice from './SuggestMultipleChoice';
import SuggestTypeIn from './SuggestTypeIn';
import SuggestFillIn from './SuggestFillIn';
import { submitChallenge } from '../api';

import './style.scss';

const mapStateToProps = ({ quizSubmission, courses }) => ({ quizSubmission, courses });
const mapDispatchToProps = { setSuggestionChallenge };

@connect(mapStateToProps, mapDispatchToProps)
class SuggestTypeSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			previewQuiz: null,
			isQuizComplete: false,
			checkResult: null,
			isSubmitting: false,
		};
		document.title = 'Sololearn | Suggest a Quiz';
	}
	componentWillUnmount() {
		this.props.setSuggestionChallenge(null);
	}
	format = () => {
		if (this.props.quizSubmission !== null) {
			const { quizSubmission, courses } = this.props;
			const { id, iconUrl, languageName } = courses
				.find(course => course.id === quizSubmission.courseID);
			const { question } = quizSubmission;
			const answers = quizSubmission.answers
				.map(({ isCorrect, text }, idx) => ({ isCorrect, text, id: idx }));
			return {
				language: { id, iconUrl, languageName }, question, answers, id: quizSubmission.id,
			};
		}
		return null;
	}
	getSuggestComp = (type) => {
		const props = { setPreview: this.setPreview, init: this.format() };
		switch (type) {
		case 'multiple-choice':
			return <SuggestMultipleChoice {...props} />;
		case 'type-in':
			return <SuggestTypeIn {...props} />;
		case 'fill-in':
			return <SuggestFillIn {...props} />;
		default:
			throw new Error('Unknown suggest quiz type');
		}
	}
	setPreview = (previewQuiz) => {
		this.setState({ previewQuiz });
	}
	closePreview = () => {
		this.setPreview(null);
	}
	handleSubmit = () => {
		this.setState({ isSubmitting: true });
		const { previewQuiz } = this.state;
		const answers = previewQuiz.answers
			.map(({ text, properties, isCorrect }) => ({ text, properties, isCorrect }));
		const quiz = {
			...previewQuiz,
			answers,
		};
		submitChallenge(quiz)
			.then(() => browserHistory.push('/quiz-factory/my-submissions'));
	}
	checkComplete = ({ isComplete }) => {
		this.setState({ isQuizComplete: isComplete });
	}
	onQuizButtonClick = () => {
		const { checkResult } = this.state;
		if (checkResult === null) {
			this.setState({ checkResult: this.quiz.check() });
		}
	}
	check = () => {
		this.setState({ checkResult: this.quiz.check() });
	}
	tryAgain = () => {
		this.quiz.tryAgain();
		this.setState({ checkResult: null, isQuizComplete: false });
	}
	get checkBarLabel() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return 'Check';
		}
		return 'Try again';
	}
	get checkBarOnClick() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return this.check;
		}
		return this.tryAgain;
	}
	render() {
		const {
			previewQuiz, checkResult, isQuizComplete, isSubmitting,
		} = this.state;
		const actions = [
			<FlatButton onClick={this.closePreview} label="Cancel" primary />,
			<LoadingButton raised onClick={this.handleSubmit} label="Submit" primary loading={isSubmitting} />,
		];
		return (
			<Layout>
				{this.getSuggestComp(this.props.params.type)}
				<Dialog
					open={previewQuiz !== null}
					actions={actions}
					onRequestClose={this.closePreview}
				>
					{previewQuiz !== null ? (
						<div>
							<Paper>
								<Quiz
									quiz={previewQuiz}
									onChange={this.checkComplete}
									disabled={checkResult !== null}
									ref={(q) => { this.quiz = q; }}
								/>
							</Paper>
							<CheckBar
								onClick={this.checkBarOnClick}
								disabled={!isQuizComplete}
								secondary
								label={this.checkBarLabel}
								status={this.state.checkResult}
							/>
						</div>
					) : null}
				</Dialog>
			</Layout>
		);
	}
}

export default SuggestTypeSelector;
