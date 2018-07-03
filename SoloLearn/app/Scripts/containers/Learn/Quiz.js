// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

// Redux modules
import { isLoaded } from 'reducers';
import { selectModule, selectLesson, selectQuiz } from 'actions/learn';
import Progress, { PointExchangeTypes } from 'api/progress';

// Marterial UI components
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';

// Additional data and components
import QuizAnswers, { CheckBar } from 'components/Shared/Quiz';
import QuizText from '../Learn/QuizText';

// i18n

const styles = {
	wrapper: {
		position: 'relative',
		// overflow: 'hidden',

	},

	skipText: {
		float: 'right',
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

class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hintOpened: false,
			unlockOpened: false,
			notAvailable: false,
			checkResult: null,
			isQuizComplete: false,
		};
		this.hintPrice = 0;
		this.skipPrice = 0;
	}

	componentWillUnmount() {
		this.props.selectLesson(null);
		this.props.selectQuiz(null);
	}

	handleHint = () => {
		if (Progress.consumePoints(this.hintPrice)) {
			Progress.applyHint(this.props.activeQuiz.id, PointExchangeTypes.Hint, this.hintPrice);
			if (this.quiz.hint()) {
				this.setState({ checkResult: true });
			}
			this.handleHintDialogClose();
		} else {
			this.setState({ notAvailable: true });
		}
	}

	handleHintDialogOpen = () => {
		this.setState({ hintOpened: true });
	}

	handleHintDialogClose = () => {
		this.setState({ hintOpened: false });
	}

	handleUnlock = () => {
		if (Progress.consumePoints(this.skipPrice)) {
			Progress.applyHint(this.props.activeQuiz.id, PointExchangeTypes.Skip, this.skipPrice);
			this.quiz.unlock();
			this.setState({ checkResult: true });
			this.handleUnlockDialogClose();
		} else {
			this.setState({ notAvailable: true });
		}
	}

	handleUnlockDialogOpen = () => {
		this.setState({ unlockOpened: true });
	}

	handleUnlockDialogClose = () => {
		this.setState({ unlockOpened: false });
	}

	handleMessageDialogClose = () => {
		this.setState({ notAvailable: false });
	}

	check = () => {
		const checkResult = this.quiz.check();
		Progress.addResult(this.props.activeLessonId, this.props.activeQuiz.id, checkResult, 0);
		this.setState({ checkResult });
		this.props.openComments();
	}

	continueQuiz = () => {
		const lesson = this.props.activeLesson;
		const activeQuizData = this.props.activeQuiz;
		const quiz = this.props.quizzes[activeQuizData.id];

		if (this.props.isShortcut) {
			const quizIndex = this.props.shortcutLesson.quizzes.findIndex(item => item.id === quiz.id);

			if (quizIndex < this.props.shortcutLesson.quizzes.length - 1) {
				const nextQuiz = this.props.shortcutLesson.quizzes[quizIndex + 1];
				this.props.loadLessonLink(nextQuiz.id, nextQuiz.number, false, 2);
				// this.handleCheckDialogClose();
			}
		} else {
			// If lesson is checkpoint then quiz next quiz is text
			const nextisText = lesson.type === 0;

			if (this.state.checkResult) {
				const quizIndex = lesson.quizzes.indexOf(quiz);

				// If there are more quizzes in lesson, continue lesson
				if (quizIndex < lesson.quizzes.length - 1) {
					const nextQuiz = lesson.quizzes[quizIndex + 1];
					this.props
						.loadLessonLink(nextQuiz.id, parseInt(activeQuizData.number, 10) + 1, nextisText, 2);
					this.setState({ checkResult: null });
				} else {
					const { lessons } = this.props.activeModule;
					const module = this.props.activeModule;

					// If this was last lesson in module
					if (lessons[lessons.length - 1] === lesson) {
						const { modules } = this.props.course;
						// If this was last module
						if (modules[modules.length - 1] === module) {
							// TODO: Show congrats
							// alert('CONGRATS');
						} else {
							// Go back to module list
							browserHistory.push('/learn/');
						}
					} else {
						// Else show lessons
						this.setState({ checkResult: null });
						browserHistory.push(`/learn/${this.props.activeModuleId}/${this.props.params.moduleName}/`);
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
	}
	onChange = ({ isComplete }) => {
		const { isQuizComplete } = this.state;
		if (isQuizComplete !== isComplete) {
			this.setState({ isQuizComplete: isComplete });
		}
	}
	tryAgain = () => {
		this.quiz.tryAgain();
		this.setState({ checkResult: null });
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
			return 'Check';
		} else if (checkResult === true) {
			return t('learn.buttons-continue');
		}
		return t('learn.buttons-try-again');
	}
	render() {
		const {
			course,
			// params,
			quizzes,
			isLoaded,
			activeQuiz,
			activeModule,
			t,
		} = this.props;
		const { checkResult, isQuizComplete } = this.state;

		if (!isLoaded && !this.props.isShortcut) {
			return <div>Loading...</div>;
		}

		const quiz = quizzes[activeQuiz.id];

		if (!this.props.isShortcut) {
			this.hintPrice = activeModule.hintPrice;
			this.skipPrice = activeModule.skipPrice;
		}

		if (activeQuiz.isText) {
			ReactGA.ga('send', 'screenView', { screenName: 'Lesson Text Page' });
			return (
				<div className="quiz-text" style={styles.wrapper}>
					<QuizText
						type={1}
						key={quiz.id}
						quizId={quiz.id}
						glossary={this.props.glossary}
						textContent={quiz.textContent}
						courseLanguage={course.language}
					/>
					<RaisedButton
						label={t('learn.buttons-continue')}
						style={styles.skipText}
						labelColor="#fff"
						backgroundColor="#8bc34a"
						onClick={() =>
							this.props.loadLessonLink(
								activeQuiz.id,
								parseInt(activeQuiz.number, 10) + 1,
								false,
								2,
							)
						}
					/>
				</div>
			);
		}

		const hintActions = [
			<FlatButton
				label={t('common.cancel-title')}
				onClick={this.handleHintDialogClose}
			/>,
			<FlatButton
				label={t('learn.popups.hint-popup-ok-action-title')}
				onClick={this.handleHint}
			/>,
		];

		const unlockActions = [
			<FlatButton
				label={t('common.cancel-title')}
				onClick={this.handleUnlockDialogClose}
			/>,
			<FlatButton
				label={t('learn.popups.unlock-popup-ok-action-title')}
				onClick={this.handleUnlock}
			/>,
		];
		ReactGA.ga('send', 'screenView', { screenName: 'Lesson Quiz Page' });
		return (
			<div className="quiz" style={styles.wrapper}>
				<QuizAnswers
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
				<Dialog
					title={t('learn.popups.unlock-popup-title')}
					actions={unlockActions}
					open={this.state.unlockOpened}
					onRequestClose={this.handleUnlockDialogClose}
				>
					{t('learn.popups.unlock.description', { price: this.skipPrice, total: this.props.userXp })}
				</Dialog>
				<Dialog
					title="Get a hint"
					actions={hintActions}
					open={this.state.hintOpened}
					onRequestClose={this.handleHintDialogClose}
				>
					Use {this.hintPrice} XP of you total {this.props.userXp} XP to get a hint
				</Dialog>
			</div >
		);
	}
}

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

const mapDispatchToProps = dispatch => bindActionCreators({
	selectModule,
	selectLesson,
	selectQuiz,
}, dispatch);

const translatedQuiz = translate()(Quiz);

export default connect(mapStateToProps, mapDispatchToProps)(translatedQuiz);
