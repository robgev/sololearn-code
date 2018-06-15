import React, { Component } from 'react';
import Layout from 'components/Layouts/GeneralLayout';
import { Paper, TextField, RaisedButton } from 'material-ui';

import ChooseLanguage from '../components/ChooseLanguage';

import './style.scss';

class SuggestTypeIn extends Component {
	state = {
		isLanguageSelectorOpen: false,
		language: null,
		question: '',
		answer: '',
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
	render() {
		const {
			isLanguageSelectorOpen, language, question, answer,
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
					<RaisedButton label="Preview" fullWidth primary />
				</div>
				<ChooseLanguage
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
				/>
			</Layout>
		);
	}
}

export default SuggestTypeIn;
