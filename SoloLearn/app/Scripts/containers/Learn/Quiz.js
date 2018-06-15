// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

// Redux modules
import Service from 'api/service';
import { isLoaded } from 'reducers';
import { selectModule, selectLesson, selectQuiz } from 'actions/learn';
import Progress, { PointExchangeTypes, ProgressState } from 'api/progress';
import Popup from 'api/popupService';

// Marterial UI components
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

// Additional data and components
import QuizSelector, { QuizType } from '../Learn/QuizSelector';
import QuizText from '../Learn/QuizText';
import { LessonType } from './QuizManager';

// i18n

const styles = {
	wrapper: {
		position: 'relative',
		overflow: 'hidden',

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
			checkOpened: false,
			notAvailable: false,
			isCorrect: false,
		};
		this.hintPrice = 0;
		this.skipPrice = 0;
		this.retryIndex = 0;
	}

genereteQuestion = (quiz) => {
	const quizType = quiz.type;
	const question = quiz.question;
	let questionText = '';

	if (quizType == QuizType.PlaceholderTypeIn || quizType == QuizType.PlaceholderDragAndDrop ||
quizType == QuizType.PlaceholderImageDragAndDrop) {
		const formatterRegex = /\[!([a-zA-Z0-9]+)!\].*/gi;
		const match = formatterRegex.exec(question);
		if (match) {
			questionText = question.substring(0, match.index).trim();
		} else {
			questionText = question;
		}
	} else {
		questionText = question;
	}

	return questionText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>');
}

handleHint = () => {
	if (Progress.consumePoints(this.hintPrice)) {
		Progress.applyHint(this.props.activeQuiz.id, PointExchangeTypes.Hint, this.hintPrice);
		this._child._quizSelectorChild.hint();
		this.handleHintDialogClose();
		const { isCorrect } = this._child._quizSelectorChild;
		// Do fast with rewriting :D
		if (isCorrect) {
			this.handleCheck(null, true);
		}
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
		this._child._quizSelectorChild.unlock();
		this.handleCheck(null, true); // THIS SMELLS!
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

handleCheck = (e, forceTrue = false) => {
	const isCorrect = forceTrue || this._child._quizSelectorChild.check();

	if (this.props.isShortcut) {
		const shortcutLives = this.props.shortcutLives;
		const isShortcutCorrectCounts = this.props.isShortcutCorrectCounts;

		this.props.updateShorctutData(!isCorrect ? shortcutLives - 1 : shortcutLives, isCorrect ? isShortcutCorrectCounts + 1 : isShortcutCorrectCounts);

		const activeQuizData = this.props.activeQuiz;
		const quiz = this.props.quizzes[activeQuizData.id];
		const quizIndex = this.props.shortcutLesson.quizzes.findIndex(item => item.id == quiz.id);
		if (quizIndex == this.props.shortcutLesson.quizzes.length - 1) {
			this.finilizeShortcut();
		}
	} else {
		Progress.addResult(this.props.activeLessonId, this.props.activeQuiz.id, isCorrect, 0);
	}

	this.setState({ isCorrect });
	this.handleCheckDialogOpen();
}

handleCheckDialogOpen = async () => {
	this.setState({ checkOpened: true });
}

handleCheckDialogClose = () => {
	this.setState({ checkOpened: false });
}

continueQuiz = () => {
	const lesson = this.props.activeLesson;
	const activeQuizData = this.props.activeQuiz;
	const quiz = this.props.quizzes[activeQuizData.id];

	if (this.props.isShortcut) {
		const quizIndex = this.props.shortcutLesson.quizzes.findIndex(item => item.id == quiz.id);

		if (quizIndex < this.props.shortcutLesson.quizzes.length - 1) {
			const nextQuiz = this.props.shortcutLesson.quizzes[quizIndex + 1];
			this.props.loadLessonLink(nextQuiz.id, nextQuiz.number, false, 2);
			this.handleCheckDialogClose();
		}
	} else {
		// If lesson is checkpoint then quiz next quiz is text
		const nextisText = lesson.type == 0;

		if (this.state.isCorrect) {
			const quizIndex = lesson.quizzes.indexOf(quiz);

			// If there are more quizzes in lesson, continue lesson
			if (quizIndex < lesson.quizzes.length - 1) {
				const nextQuiz = lesson.quizzes[quizIndex + 1];
				this.props.loadLessonLink(nextQuiz.id, parseInt(activeQuizData.number) + 1, nextisText, 2);
				this.setState({ isCorrect: false });
			} else {
				const module = this.props.activeModule;
				const lessons = module.lessons;

				// If this was last lesson in module
				if (lessons[lessons.length - 1] == lesson) {
					const modules = this.props.course.modules;
					// If this was last module
					if (modules[modules.length - 1] == module) {
						// Show congrats
						alert('CONGRATS');
					} else {
						// Go back to module list
						browserHistory.push('/learn/');
					}
				} else {
					// Else show lessons
					this.setState({ isCorrect: false });
					browserHistory.push(`/learn/${this.props.activeModuleId}/${this.props.params.moduleName}/`);
				}
				// return;
			}

			this.handleCheckDialogClose();
		} else {
			const nextQuizNumber = nextisText ? parseInt(activeQuizData.number) - 1 : parseInt(activeQuizData.number);

			this.props.loadLessonLink(activeQuizData.id, nextQuizNumber, nextisText, 2);
			this.handleCheckDialogClose();
		}
	}
}

tryAgain = () => {
	this.setState({
		checkOpened: false,
		isCorrect: false,
	});

	this.retryIndex++;
}

finilizeShortcut = () => {
	const lesson = this.props.shortcutLesson;
	const percentage = this.props.isShortcutCorrectCounts * 100 / lesson.quizzes.length;
	let points = null;

	if (percentage >= 85) {
		points = 5;
	} else if (percentage >= 75) {
		points = 4;
	} else {
		points = 3;
	}

	const modules = this.props.course.modules;
	const lessons = [];
	for (let i = 0; i < modules.length; i++) {
		if (modules[i].id == lesson.moduleId) { break; }

		const ml = modules[i].lessons;
		for (let j = 0; j < ml.length; j++) {
			if (Progress.getLessonState(ml[j]).visualState != ProgressState.Normal) {
				lessons.push(ml[j]);
			}
		}
	}

	const lessonsProgress = [];
	for (let i = 0; i < lessons.length; i++) {
		const lessonProgress = {
			isStarted: false,
			isCompleted: true,
			attempt: 1,
			bestScore: points,
			lessonID: lessons[i].id,
			score: points,
			activeQuizID: 0,
			quizzes: [],
		};
		lessonsProgress.push(lessonProgress);

		const quizzes = lessons[i].quizzes;
		for (let j = 0; j < quizzes.length; j++) {
			const quizProgress = {
				attempt: 1,
				isCompleted: true,
				quizID: quizzes[j].id,
				time: 2424,
				score: points / lessons[i].quizzes.length,
			};
			lessonProgress.quizzes.push(quizProgress);
		}
	}

	new Promise((resolve, reject) => {
		Progress.addShortcut(lessonsProgress);
		resolve();
	}).then(() => {
		this.props.exitShortcut();
	});
}

render() {
	const {
		course,
		params,
		quizzes,
		isLoaded,
		activeQuiz,
		activeModule,
		t,
	} = this.props;

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
					onClick={() => this.props.loadLessonLink(activeQuiz.id, parseInt(activeQuiz.number, 10) + 1, false, 2)}
				/>
			</div>
		);
	}

	const that = this;

	const hintActions = [
		{
			componentType: FlatButton,
			label: 'popupCancel',
			primary: false,
			actionCallback: that.handleHintDialogClose,
		},
		{
			componentType: FlatButton,
			label: 'hintHintConfirmApply',
			primary: true,
			actionCallback: that.handleHint,
		},
	];

	const unlockActions = [
		{
			componentType: FlatButton,
			label: 'popupCancel',
			primary: false,
			actionCallback: that.handleUnlockDialogClose,
		},
		{
			componentType: FlatButton,
			label: 'hintSkipConfirmApply',
			primary: false,
			actionCallback: that.handleUnlock,
		},
	];

	const isCheckpoint = !this.props.isShortcut ? this.props.activeLesson.type == LessonType.Checkpoint : this.props.shortcutLesson.type == LessonType.Checkpoint;
	const resultButtonLabel = this.props.isShortcut ? 'Continue' : (this.state.isCorrect ? t('learn.buttons-continue') : t('learn.buttons-try-again'));
	const resultButtonAction = this.props.isShortcut ? this.continueQuiz : (this.state.isCorrect ? this.continueQuiz : this.tryAgain);
	ReactGA.ga('send', 'screenView', { screenName: 'Lesson Quiz Page' });
	return (
		<div className="quiz" style={styles.wrapper}>
			<div className="actions" style={styles.quizActions}>
				{ !this.props.isShortcut &&
				<div>
					{ (quiz.type == QuizType.TypeIn || quiz.type == QuizType.PlaceholderTypeIn) &&
					<div style={styles.quizAction}>
						<FlatButton
							label={t('learn.buttons-hint-answer')}
							onTouchTap={this.handleHintDialogOpen}
						/>
						{ this.state.hintOpened && Popup.getPopup(Popup.generatePopupActions(hintActions), this.state.hintOpened, this.handleHintDialogClose, [ { key: 'hintHintConfirmText', replacemant: this.hintPrice } ]) }
					</div>
					}
					<div style={styles.quizAction}>
						<FlatButton
							label={t('learn.buttons-unlock-answer')}
							onTouchTap={this.handleUnlockDialogOpen}
						/>
						{ this.state.unlockOpened && Popup.getPopup(Popup.generatePopupActions(unlockActions), this.state.unlockOpened, this.handleUnlockDialogClose, [ { key: 'hintSkipConfirmText', replacemant: this.skipPrice } ]) }
					</div>
				</div>
				}

				{ this.state.notAvailable && Popup.getPopup(Popup.generatePopupActions([ {
					componentType: FlatButton, label: 'hintHintConfirmApply', primary: true, actionCallback: that.handleMessageDialogClose,
				} ]), true, this.handleHintDialogClose, [ { key: 'hintNoEnoughPoints', replacemant: '' } ]) }
			</div>

			<div dangerouslySetInnerHTML={{ __html: this.genereteQuestion(quiz) }} style={styles.quizQuestion} />

			<QuizSelector quiz={quiz} retryIndex={this.retryIndex} ref={(child) => { this._child = child; }} />

			{ !this.state.checkOpened &&
				<RaisedButton
					labelColor="#fff"
					backgroundColor="#8bc34a"
					label={t('learn.buttons-check')}
					style={styles.checkButton}
					onTouchTap={this.handleCheck}
				/>
			}
			{ this.state.checkOpened &&
				<RaisedButton
					labelColor="#fff"
					label={resultButtonLabel}
					style={styles.resultButton}
					backgroundColor="#8bc34a"
					onTouchTap={resultButtonAction}
				/>
			}
			{ this.state.checkOpened && Popup.checkPopup({
				isCheckpoint,
				isCorrect: this.state.isCorrect,
				isShortcut: this.props.isShortcut,
				actionCallback: this.continueQuiz,
				shortcutLives: this.props.shortcutLives,
			})}
		</div>
	);
}

componentWillReceiveProps(newProps) {
	const { activeQuiz: newQuiz } = newProps;
	const { activeQuiz } = this.props;
	const { isCorrect } = this.state;
	if (isCorrect && newQuiz.id !== activeQuiz.id && newQuiz.number !== activeQuiz.number) {
		this.setState({ checkOpened: false });
	}
}

componentWillUnmount() {
	this.props.selectLesson(null);
	this.props.selectQuiz(null);
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
	selectModule,
	selectLesson,
	selectQuiz,
}, dispatch);

const translatedQuiz = translate()(Quiz);

export default connect(mapStateToProps, mapDispatchToProps)(translatedQuiz);

// (this.state.countLoaded ? this.commentsCount : "") + "
