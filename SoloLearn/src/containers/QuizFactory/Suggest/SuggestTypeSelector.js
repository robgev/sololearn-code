import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Quiz, { CheckBar } from 'components/Quiz';
import { FlatButton, PromiseButton } from 'components/molecules';
import { Popup, PopupContent, PopupActions, PopupTitle, Container } from 'components/atoms';
import Layout from '../Layout';
import SuggestMultipleChoice from './SuggestMultipleChoice';
import SuggestTypeIn from './SuggestTypeIn';
import SuggestFillIn from './SuggestFillIn';
import { submitChallenge } from '../api';

const mapStateToProps = ({ courses }) => ({ courses });

@connect(mapStateToProps)
@translate()
class SuggestTypeSelector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			previewQuiz: null,
			isQuizComplete: false,
			checkResult: null,
		};
		document.title = 'Sololearn | Suggest a Quiz';
	}
	format = () => {
		if (this.props.location.state) {
			const { courses } = this.props;
			const { init } = this.props.location.state;
			const { id, iconUrl, languageName } = courses
				.find(course => course.id === init.courseID);
			const { question } = init;
			const answers = init.answers
				.map(({ isCorrect, text }, idx) => ({ isCorrect, text, id: idx }));
			return {
				language: { id, iconUrl, languageName }, question, answers, id: init.id,
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
		const { previewQuiz } = this.state;
		const answers = previewQuiz.answers
			.map(({ text, properties, isCorrect }) => ({ text, properties, isCorrect }));
		const quiz = {
			...previewQuiz,
			answers,
		};
		return submitChallenge(quiz)
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
			previewQuiz, checkResult, isQuizComplete,
		} = this.state;
		return (
			<Layout>
				{this.getSuggestComp(this.props.params.type)}
				<Popup
					open={previewQuiz !== null}
					onClose={this.closePreview}
				>
					<PopupTitle>{t('common.submit-action-title')}</PopupTitle>
					{previewQuiz !== null
						? (
							<PopupContent>
								<Container>
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
								</Container>
							</PopupContent>
						)
						: null}
					<PopupActions>
						<FlatButton
							color="primary"
							onClick={this.closePreview}
						>
							{t('common.cancel-title')}
						</FlatButton>
						<PromiseButton
							raised
							fire={this.handleSubmit}
							color="primary"
						>
							{t('common.submit-action-title')}
						</PromiseButton>
					</PopupActions>
				</Popup>
			</Layout>
		);
	}
}

export default SuggestTypeSelector;
