import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import LanguageSelectorTab from './LanguageSelectorTab';
import QuestionInput from './QuestionInput';
import PreviewButton from './PreviewButton';

@translate()
class SuggestTypeIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			language: null,
			question: props.t('factory.quiz-guess-the-output-question-title'),
			answer: '',
		};
	}
	componentWillMount() {
		if (this.props.init !== null) {
			const { language, question, answers } = this.props.init;
			this.setState({ language, question, answer: answers[0].text });
		}
	}
	selectLanguage = (language) => {
		this.setState({ language });
	}
	onQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	}
	onAnswerChange = (e) => {
		this.setState({ answer: e.target.value });
	}
	makeQuiz = () => {
		const { question, answer, language } = this.state;
		return {
			type: 2,
			question: question.trim(),
			courseID: language.id,
			answers: [ {
				text: answer, id: 1, properties: { prefix: '', postfix: '' }, isCorrect: true,
			} ],
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	isComplete = () => {
		const { question, answer, language } = this.state;
		return question.trim().length !== 0 && answer.trim() !== '' && language !== null;
	}
	render() {
		const { t } = this.props;
		const {
			language, question, answer,
		} = this.state;
		return (
			<div className="quiz-factory">
				<LanguageSelectorTab language={language} selectLanguage={this.selectLanguage} />
				<QuestionInput question={question} onChange={this.onQuestionChange} />
				<Paper className="container">
					<span className="title">{t('factory.quiz-guess-the-output-answers-title')}</span>
					<div className="answers">
						<TextField
							name="answer"
							value={answer}
							onChange={this.onAnswerChange}
							fullWidth
							placeholder={t('factory.quiz-answer-placeholder')}
						/>
					</div>
				</Paper>
				<PreviewButton
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
			</div>
		);
	}
}

SuggestTypeIn.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestTypeIn;
