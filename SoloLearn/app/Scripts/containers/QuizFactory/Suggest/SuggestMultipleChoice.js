import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getQuizFactoryCourses } from 'selectors';
import { Dialog, List, ListItem, Paper, Checkbox, TextField, Divider, RaisedButton } from 'material-ui';
import Layout from 'components/Layouts/GeneralLayout';

import './SuggestMultipleChoice.scss';

class SuggestMultipleChoice extends Component {
	state = {
		isLanguageSelectorOpen: false,
		language: null,
		question: '',
		answers: [
			{ correct: false, text: '' },
			{ correct: false, text: '' },
			{ correct: false, text: '' },
			{ correct: false, text: '' },
		],
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
			answers: state.answers.map((a, i) => (i === idx ? { ...a, correct: !a.correct } : a)),
		}));
	}
	render() {
		const { courses } = this.props;
		const {
			isLanguageSelectorOpen, language, question, answers,
		} = this.state;
		return (
			<Layout>
				<div className="quiz-factory-multiple-choice">
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
											checked={answer.correct}
											onCheck={() => this.toggleAnswer(idx)}
										/>
									</div>
								))
							}
						</div>
					</Paper>
					<Dialog
						modal={false}
						autoScrollBodyContent
						title="Choose Language"
						open={isLanguageSelectorOpen}
						onRequestClose={this.toggleLanguageSelector}
					>
						<List>
							{courses.map((course, idx) => (
								<div key={course.id} onClick={() => this.selectLanguage(course)} tabIndex={0} role="button">
									<ListItem primaryText={course.languageName} leftIcon={<img src={course.iconUrl} alt="" />} />
									{idx !== courses.length - 1 ? <Divider inset /> : null}
								</div>
							))}
						</List>
					</Dialog>
					<RaisedButton label="Preview" fullWidth primary />
				</div>
			</Layout>
		);
	}
}

SuggestMultipleChoice.propTypes = {
	courses: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.number.isRequired,
		iconUrl: PropTypes.string.isRequired,
		languageName: PropTypes.string.isRequired,
	})).isRequired,
};

const mapStateToProps = state => ({ courses: getQuizFactoryCourses(state) });

export default connect(mapStateToProps)(SuggestMultipleChoice);
