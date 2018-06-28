import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, Checkbox, TextField, RaisedButton } from 'material-ui';
import { LanguageSelector } from '../components';

class SuggestMultipleChoice extends Component {
	state = {
		isLanguageSelectorOpen: false,
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
	toggleLanguageSelector = () => {
		this.setState(state => ({ isLanguageSelectorOpen: !state.isLanguageSelectorOpen }));
	}
	selectLanguage = (language) => {
		this.setState({ language });
		this.toggleLanguageSelector();
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
			type: 1, answers: answers.filter(a => a.text !== ''), question, courseID: language.id,
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	isComplete = () => {
		const { question, language } = this.state;
		const answers = this.state.answers.filter(a => a.text !== '');
		return question !== '' && answers.length >= 2 && answers.some(a => a.isCorrect) && language !== null;
	}
	render() {
		const {
			isLanguageSelectorOpen, language, question, answers,
		} = this.state;
		return (
			<div className="quiz-factory">
				<Paper onClick={this.toggleLanguageSelector} className="selected-language container">
					<span className="title">Language</span>
					<div className="with-image">
						<span className="language-name">{language === null ? 'Select' : language.languageName}</span>
						<img src="/assets/keyboard_arrow_right.svg" alt="" />
					</div>
				</Paper>
				<Paper className="question container">
					<span className="title">Question</span>
					<textarea value={question} onChange={this.onQuestionChange} placeholder="Type in Your Question" />
				</Paper>
				<Paper className="container">
					<span className="title">Answers</span>
					<div className="answers">
						{
							answers.map(answer => (
								<div
									className="answer-item"
									key={`Option${answer.id}`}
								>
									<TextField
										name={`Answer field ${answer.id}`}
										className="input"
										value={answer.text}
										placeholder={`Option ${answer.id + 1}`}
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
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
					filter={course => course.isQuizFactoryEnabled}
				/>
				<RaisedButton
					className="preview-button"
					label="Preview"
					fullWidth
					primary
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
			</div>
		);
	}
}

SuggestMultipleChoice.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestMultipleChoice;
