// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';

// Redux modules
import { isLoaded } from 'reducers';
import { selectModule, selectLesson, selectQuiz, deductExp } from 'actions/learn';
import Progress, { PointExchangeTypes } from 'api/progress';

// Marterial UI components
import { Popup, PopupContent, PopupTitle, PopupActions, PopupContentText, Loading } from 'components/atoms';
import { FlatButton, RaisedButton } from 'components/molecules';

// Additional data and components
import QuizAnswers, { CheckBar, TopBar } from 'components/Quiz';
import QuizText from './QuizText';

const styles = {
	wrapper: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
	},

	skipText: {
		margin: '15px 48px 0 0',
	},

	quizQuestion: {
		textAlign: 'center',
		margin: '15px 0',
		fontSize: '17px',
	},

	quizActions: {
		overflow: 'hidden',
		backgroundColor: '#8bc34a',
	},

	quizAction: {
		float: 'right',
	},

	checkButton: {
		float: 'right',
		margin: '60px 0 0 0',
	},

	resultButton: {
		float: 'right',
		margin: '60px 0 0 0',
		position: 'relative',
	},
};

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'quizzes'),
	course: state.course,
	activeModuleId: state.activeModuleId,
	activeModule: state.modulesMapping[state.activeModuleId],
	activeLessonId: state.activeLessonId,
	activeLesson: state.lessonsMapping[state.activeLessonId],
	glossary: state.course.glossary,
	activeQuiz: state.activeQuiz,
	quizzes: state.quizzesMapping,
	userXp: state.userProfile.xp,
});

const mapDispatchToProps = {
	selectModule,
	selectLesson,
	selectQuiz,
	deductExp,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Quiz extends Component {
	state = {
		isHintPopupOpen: false,
		isUnlockPopupOpen: false,
		notAvailable: false,
		checkResult: null,
		isQuizComplete: false,
	};

	closeNotAvailablePopup = () => {
		this.setState({ notAvailable: false });
	}

	componentDidMount() {
		ReactGA.ga('send', 'screenView', { screenName: 'Lesson Quiz Page' });
	}

	openHintPopup = () => {
		this.setState({ isHintPopupOpen: true });
	}

	closeHintPopup = () => {
		this.setState({ isHintPopupOpen: false });
	}

	openUnlockPopup = () => {
		this.setState({ isUnlockPopupOpen: true });
	}

	closeUnlockPopup = () => {
		this.setState({ isUnlockPopupOpen: false });
	}

	handleHint = () => {
		if (Progress.consumePoints(this.props.activeModule.hintPrice)) {
			Progress.applyHint(
				this.props.activeQuiz.id,
				PointExchangeTypes.Hint,
				this.props.activeModule.hintPrice,
			);
			this.props.deductExp(this.props.activeModule.hintPrice);
			this.hint();
			this.closeHintPopup();
		} else {
			this.setState({ notAvailable: true });
		}
	}

	handleUnlock = () => {
		if (Progress.consumePoints(this.props.activeModule.skipPrice)) {
			Progress.applyHint(
				this.props.activeQuiz.id,
				PointExchangeTypes.Skip,
				this.props.activeModule.skipPrice,
			);
			this.props.deductExp(this.props.activeModule.skipPrice);
			this.unlock();
			this.closeUnlockPopup();
		} else {
			this.setState({ notAvailable: true });
		}
	}

	check = (force = false) => {
		const checkResult = force === true ? true : this.quiz.check();
		Progress.addResult(this.props.activeLessonId, this.props.activeQuiz.id, checkResult, 0);
		this.setState({ checkResult, isQuizComplete: true });
		this.props.openComments();
	}

	continueQuiz = () => {
		const lesson = this.props.activeLesson;
		const activeQuizData = this.props.activeQuiz;
		const quiz = this.props.quizzes[activeQuizData.id];

		// If lesson is checkpoint then quiz next quiz is text
		const nextisText = lesson.type === 0;

		if (this.state.checkResult) {
			const quizIndex = lesson.quizzes.indexOf(quiz);

			// If there are more quizzes in lesson, continue lesson
			if (quizIndex < lesson.quizzes.length - 1) {
				const nextQuiz = lesson.quizzes[quizIndex + 1];
				this.props
					.loadLessonLink(nextQuiz.id, parseInt(activeQuizData.number, 10) + 1, nextisText, 2);
				this.setState({ checkResult: null, isQuizComplete: false });
			} else {
				const { lessons } = this.props.activeModule;
				const module = this.props.activeModule;

				// If this was last lesson in module
				if (lessons[lessons.length - 1] === lesson) {
					const { modules } = this.props.course;
					// If this was last module
					if (modules[modules.length - 1] === module) {
						browserHistory.push(`/certificate/${this.props.course.id}`);
					} else {
						// Go back to module list
						browserHistory.push(`/learn/course/${this.props.params.courseName}`);
					}
				} else {
					// Else show lessons
					this.setState({ checkResult: null, isQuizComplete: false });
					browserHistory.push(`/learn/course/${this.props.params.courseName}/${this.props.params.moduleName}`);
				}
				// return;
			}

			// this.handleCheckDialogClose();
		} else {
			const nextQuizNumber = nextisText
				? parseInt(activeQuizData.number, 10) - 1
				: parseInt(activeQuizData.number, 10);

			this.props.loadLessonLink(activeQuizData.id, nextQuizNumber, nextisText, 2);
			// this.handleCheckDialogClose();
		}
	}
	onChange = ({ isComplete }) => {
		const { isQuizComplete } = this.state;
		if (isQuizComplete !== isComplete) {
			this.setState({ isQuizComplete: isComplete });
		}
	}
	tryAgain = () => {
		this.quiz.tryAgain();
		this.setState({ checkResult: null, isQuizComplete: false });
	}
	get checkBarOnClick() {
		const { checkResult } = this.state;
		if (checkResult === null) {
			return this.check;
		} else if (checkResult === true) {
			return this.continueQuiz;
		}
		return this.tryAgain;
	}
	get checkBarLabel() {
		const { checkResult } = this.state;
		const { t } = this.props;
		if (checkResult === null) {
			return t('learn.buttons-check');
		} else if (checkResult === true) {
			return t('learn.buttons-continue');
		}
		return t('learn.buttons-try-again');
	}
	unlock = () => {
		this.quiz.unlock();
		this.check(true);
	}
	hint = () => {
		if (this.quiz.hint()) {
			this.check(true);
		}
	}
	get isHintable() {
		const { activeQuiz, quizzes } = this.props;
		const { type } = quizzes[activeQuiz.id];
		return type === 2 || type === 3;
	}
	render() {
		const {
			course,
			// params,
			quizzes,
			activeQuiz,
			activeLesson,
			activeModule,
			t,
		} = this.props;
		const { checkResult, isQuizComplete } = this.state;

		if (!this.props.isLoaded) {
			return <Loading />;
		}

		const quiz = quizzes[activeQuiz.id];
		this.props.activeModule.skipPrice = activeModule.skipPrice;
		if (activeQuiz.isText) {
			ReactGA.ga('send', 'screenView', { screenName: 'Lesson Text Page' });
			return (
				<div className="quiz-text" style={{ ...styles.wrapper, alignItems: 'flex-end' }}>
					<QuizText
						type={1}
						key={quiz.id}
						quizId={quiz.id}
						activeLesson={activeLesson}
						glossary={this.props.glossary}
						textContent={quiz.textContent}
						courseLanguage={course.language}
					/>
					<RaisedButton
						color="secondary"
						onClick={() =>
							this.props.loadLessonLink(
								activeQuiz.id,
								parseInt(activeQuiz.number, 10) + 1,
								false,
								2,
							)
						}
					>
						{t('learn.buttons-continue')}
					</RaisedButton>
				</div>
			);
		}

		return (
			<div className="quiz" style={styles.wrapper}>
				<TopBar
					onUnlock={this.openUnlockPopup}
					onHint={this.openHintPopup}
					hintable={this.isHintable}
					disabled={checkResult !== null}
				/>
				<QuizAnswers
					key={activeQuiz.id}
					quiz={quiz}
					onChange={this.onChange}
					disabled={checkResult !== null}
					ref={(c) => { this.quiz = c; }}
				/>
				<CheckBar
					onClick={this.checkBarOnClick}
					disabled={!isQuizComplete}
					secondary
					label={this.checkBarLabel}
					status={this.state.checkResult}
				/>
				<Popup
					open={this.state.isUnlockPopupOpen}
					onClose={this.closeUnlockPopup}
				>
					<PopupTitle>
						{t('learn.popups.unlock-popup-title')}
					</PopupTitle>
					<PopupContent>
						<PopupContentText>
							{t('learn.popups.unlock.description', { price: this.props.activeModule.skipPrice, total: this.props.userXp })}
						</PopupContentText>
					</PopupContent>
					<PopupActions>
						<FlatButton
							onClick={this.closeUnlockPopup}
						>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton
							onClick={this.handleUnlock}
						>
							{t('learn.popups.unlock-popup-ok-action-title')}
						</FlatButton>
					</PopupActions>
				</Popup>
				<Popup
					open={this.state.isHintPopupOpen}
					onClose={this.closeHintPopup}
				>
					<PopupTitle>
						{t('quiz.get-hint-message')}
					</PopupTitle>
					<PopupContent>
						<PopupContentText>
							{t('learn.get-hint-format', { price: this.props.activeModule.hintPrice, total: this.props.userXp })}
						</PopupContentText>
					</PopupContent>
					<PopupActions>
						<FlatButton
							onClick={this.closeHintPopup}
						>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton
							onClick={this.handleHint}
						>
							{t('learn.popups.hint-popup-ok-action-title')}
						</FlatButton>
					</PopupActions>
				</Popup>
				<Popup open={this.state.notAvailable} onClose={this.closeNotAvailablePopup}>
					<PopupContent>
						<PopupContentText>{t('learn.hint-not-enough-xp')}</PopupContentText>
					</PopupContent>
				</Popup>
			</div>
		);
	}
}

export default Quiz;
