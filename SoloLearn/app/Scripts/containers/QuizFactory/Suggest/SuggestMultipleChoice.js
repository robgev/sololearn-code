import React, { Component } from 'react';
import { Paper, Checkbox, TextField, RaisedButton } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';
import QuizSelector from 'containers/Challenges/Challenge/Game/TypeSelector';
import ChooseLanguage from '../components/ChooseLanguage';

import './style.scss';

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
		preview: false,
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
		const { answers, question } = this.state;
		return { type: 1, answers: answers.filter(a => a.text !== ''), question };
	}
	preview = () => {
		this.setState(state => ({ preview: !state.preview }));
	}
	render() {
		const {
			isLanguageSelectorOpen, language, question, answers, preview,
		} = this.state;
		return (
			<Layout>
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
								answers.map((answer, idx) => (
									<div
										className="answer-item"
										key={`Option${idx}`} // eslint-disable-line react/no-array-index-key
									>
										<TextField
											name={`Answer field ${idx}`}
											className="input"
											placeholder={`Option ${idx + 1}`}
											onChange={e => this.onAnswerChange(idx, e.target.value)}
										/>
										<Checkbox
											className="checkbox"
											checked={answer.isCorrect}
											onCheck={() => this.toggleAnswer(idx)}
										/>
									</div>
								))
							}
						</div>
					</Paper>
					<ChooseLanguage
						open={isLanguageSelectorOpen}
						onClose={this.toggleLanguageSelector}
						onChoose={this.selectLanguage}
					/>
					<RaisedButton
						className="preview-button"
						label="Preview"
						fullWidth
						primary
						onClick={this.preview}
					/>
					<RaisedButton
						className="preview-button"
						label="Submit"
						fullWidth
						primary
					/>
					{preview
						? <QuizSelector quiz={this.makeQuiz()} />
						: null}
				</div>
			</Layout>
		);
	}
}

export default SuggestMultipleChoice;
