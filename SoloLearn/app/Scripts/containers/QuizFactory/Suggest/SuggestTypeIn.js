import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, TextField, RaisedButton } from 'material-ui';
import { LanguageSelector } from '../components';

class SuggestTypeIn extends Component {
	state = {
		isLanguageSelectorOpen: false,
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
			isLanguageSelectorOpen, language, question, answer,
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
					<textarea value={question} onChange={this.onQuestionChange} placeholder="What is the output of this code?" />
				</Paper>
				<Paper className="container">
					<span className="title">Answers</span>
					<div className="answers">
						<TextField
							name="answer"
							value={answer}
							onChange={this.onAnswerChange}
							fullWidth
							placeholder="Type in the Correct Answer"
						/>
					</div>
				</Paper>
				<RaisedButton
					label="Preview"
					fullWidth
					primary
					className="preview-button"
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
					filter={course => course.isQuizFactoryEnabled}
				/>
			</div>
		);
	}
}

SuggestTypeIn.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestTypeIn;
