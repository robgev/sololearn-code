import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Localize from 'components/Localize';
import LanguageSelectorTab from './LanguageSelectorTab';
import QuestionInput from './QuestionInput';
import PreviewButton from './PreviewButton';

class SuggestTypeIn extends Component {
	state = {
		language: null,
		question: '',
		answer: '',
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
			question,
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
		return question !== '' && answer !== '' && language !== null;
	}
	render() {
		const {
			language, question, answer,
		} = this.state;
		return (
			<Localize>
				{({ t }) => (
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
				)}
			</Localize>
		);
	}
}

SuggestTypeIn.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestTypeIn;
