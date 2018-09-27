import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField';
import Localize from 'components/Localize';
import LanguageSelectorTab from './LanguageSelectorTab';
import QuestionInput from './QuestionInput';
import PreviewButton from './PreviewButton';

class SuggestMultipleChoice extends Component {
	state = {
		language: null,
		question: '',
		answers: [
			{ isCorrect: false, text: '', id: 0 },
			{ isCorrect: false, text: '', id: 1 },
			{ isCorrect: false, text: '', id: 2 },
			{ isCorrect: false, text: '', id: 3 },
		],
	}
	componentWillMount() {
		if (this.props.init !== null) {
			const { language, question, answers } = this.props.init;
			this.setState({ language, question, answers });
		}
	}
	selectLanguage = (language) => {
		this.setState({ language });
	}
	onQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	}
	onAnswerChange = (idx, text) => {
		this.setState(state => ({
			answers: state.answers.map((a, i) => (i === idx ? { ...a, text } : a)),
		}));
	}
	toggleAnswer = (idx) => {
		this.setState(state => ({
			answers: state.answers.map((a, i) => (i === idx ? { ...a, isCorrect: !a.isCorrect } : a)),
		}));
	}
	makeQuiz = () => {
		const { answers, question, language } = this.state;
		return {
			type: 1,
			answers: answers
				.filter(a => a.text !== '')
				.map(a => ({ ...a, text: a.text.trim() })),
			courseID: language.id,
			question,
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	isComplete = () => {
		const { question, language } = this.state;
		const answers = this.state.answers.filter(a => a.text.trim() !== '');
		return question !== '' && answers.length >= 2 && answers.some(a => a.isCorrect) && language !== null;
	}
	render() {
		const {
			language, question, answers,
		} = this.state;
		return (
			<Localize>
				{({ t }) => (
					<div className="quiz-factory">
						<LanguageSelectorTab language={language} selectLanguage={this.selectLanguage} />
						<QuestionInput question={question} onChange={this.onQuestionChange} />
						<Paper className="container">
							<span className="title">{t('factory.quiz-multiple-choice-answers-title')}</span>
							<div className="answers">
								{
									answers.map(answer => (
										<div
											className="answer-item"
											key={`option-${answer.id}`}
										>
											<TextField
												name={`Answer field ${answer.id}`}
												className="input"
												value={answer.text}
												placeholder={`${t('factory.quiz-option')} ${answer.id + 1}`}
												onChange={e => this.onAnswerChange(answer.id, e.target.value)}
											/>
											<Checkbox
												className="checkbox"
												checked={answer.isCorrect}
												onCheck={() => this.toggleAnswer(answer.id)}
											/>
										</div>
									))
								}
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

SuggestMultipleChoice.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestMultipleChoice;
