import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { PaperContainer, Input, Container, Title, FlexBox, Checkbox } from 'components/atoms';

import LanguageSelectorTab from './LanguageSelectorTab';
import QuestionInput from './QuestionInput';
import PreviewButton from './PreviewButton';

@translate()
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
			question: question.trim(),
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	isComplete = () => {
		const { question, language } = this.state;
		const answers = this.state.answers.filter(a => a.text.trim() !== '');
		return question.trim().length !== 0
			&& answers.length >= 2
			&& answers.some(a => a.isCorrect)
			&& language !== null;
	}
	render() {
		const { t } = this.props;
		const {
			language, question, answers,
		} = this.state;
		return (
			<Container>
				<LanguageSelectorTab language={language} selectLanguage={this.selectLanguage} />
				<QuestionInput question={question} onChange={this.onQuestionChange} />
				<PaperContainer className="container">
					<Title className="title">{t('factory.quiz-multiple-choice-answers-title')}</Title>
					<Container className="answers">
						{
							answers.map(answer => (
								<FlexBox
									key={`option-${answer.id}`}
									align
								>
									<Input
										name={`Answer field ${answer.id}`}
										className="input"
										fullWidth
										value={answer.text}
										placeholder={`${t('factory.quiz-option')} ${answer.id + 1}`}
										onChange={e => this.onAnswerChange(answer.id, e.target.value)}
									/>
									<Checkbox
										className="checkbox"
										checked={answer.isCorrect}
										color="primary"
										onChange={() => this.toggleAnswer(answer.id)}
									/>
								</FlexBox>
							))
						}
					</Container>
				</PaperContainer>
				<PreviewButton
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
			</Container>
		);
	}
}

SuggestMultipleChoice.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestMultipleChoice;
