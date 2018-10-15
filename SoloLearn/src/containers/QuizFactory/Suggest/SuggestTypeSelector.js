import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Dialog from 'components/StyledDialog';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import { setSuggestionChallenge } from 'actions/quizFactory';
import Quiz, { CheckBar } from 'components/Quiz';
import LoadingButton from 'components/LoadingButton';
import Layout from '../Layout';
import SuggestMultipleChoice from './SuggestMultipleChoice';
import SuggestTypeIn from './SuggestTypeIn';
import SuggestFillIn from './SuggestFillIn';
import { submitChallenge } from '../api';

import './style.scss';
import actionContainerStyle from '../components/actionContainerStyle';

const mapStateToProps = ({ quizSubmission, courses }) => ({ quizSubmission, courses });
const mapDispatchToProps = { setSuggestionChallenge };

@connect(mapStateToProps, mapDispatchToProps)
@translate()
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
		this.setState({ checkResult: null, isQuizComplete: false });
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
		const { t } = this.props;
		const { checkResult } = this.state;
		if (checkResult === null) {
			return t('learn.buttons-check');
		}
		return t('learn.buttons-try-again');
	}
	get checkBarOnClick() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return this.check;
		}
		return this.tryAgain;
	}
	render() {
		const { t } = this.props;
		const {
			previewQuiz, checkResult, isQuizComplete, isSubmitting,
		} = this.state;
		const actions = [
			<FlatButton
				primary
				onClick={this.closePreview}
				label={t('common.cancel-title')}
			/>,
			<LoadingButton
				raised
				primary
				loading={isSubmitting}
				onClick={this.handleSubmit}
				label={t('common.submit-action-title')}
			/>,
		];
		return (
			<Layout>
				{this.getSuggestComp(this.props.params.type)}
				<Dialog
					open={previewQuiz !== null}
					actions={actions}
					onRequestClose={this.closePreview}
					actionsContainerStyle={actionContainerStyle}
					autoScrollBodyContent
				>
					{previewQuiz !== null ? (
						<div>
							<Quiz
								quiz={previewQuiz}
								onChange={this.checkComplete}
								disabled={checkResult !== null}
								ref={(q) => { this.quiz = q; }}
							/>
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
