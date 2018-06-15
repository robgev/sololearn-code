// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';
import Paper from 'material-ui/Paper';

// Redux modules
import { isLoaded } from 'reducers';
import { loadDefaults } from 'actions/defaultActions';
import {
	selectQuiz,
	selectLesson,
	selectModule,
	loadCourseInternal,
} from 'actions/learn';

// Utils
import { toSeoFrendly } from 'utils';
import Progress, { ProgressState } from 'api/progress';
import Service from 'api/service';

// Additional data and components
import Comments from 'containers/Comments/CommentsBase';
import Layout from 'components/Layouts/GeneralLayout';

import StepIcon from './StepIcon';

export const LessonType = {
	Checkpoint: 0,
	Quiz: 1,
};

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'quizzes'),
	course: state.course,
	lessons: state.lessonsMapping,
	activeQuiz: state.activeQuiz,
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	activeLesson: !state.course ? null : state.lessonsMapping[state.activeLessonId],
});

const mapDispatchToProps = dispatch => bindActionCreators({
	loadDefaults,
	loadCourseInternal,
	selectLesson,
	selectModule,
	selectQuiz,
}, dispatch);

@connect(mapStateToProps, mapDispatchToProps)
class QuizManager extends Component {
	state = {
		commentsCount: 0,
		commentsOpened: false,
	}

	async componentWillMount() {
		const {
			params,
			isLoaded,
			isShortcut,
			selectQuiz,
			shortcutLesson,
			loadCourseInternal,
		} = this.props;

		this.setState({ loading: true });

		if (!isShortcut) {
			Service.request('/AddLessonImpression', { lessonId: params.lessonId });
		}
		if (!isLoaded && !isShortcut) {
			try {
				await loadCourseInternal();
				const lessonId = parseInt(params.lessonId, 10);
				const moduleId = parseInt(params.moduleId, 10);
				// As always, there are <censored> mappings. This one being:
				// 1 - Module is disabled
				// 2 - Module is active
				// 3 - Module is finished
				const { params: { courseName, moduleName } } = this.props;
				const { _visualState: lessonState } = Progress.getLessonStateById(lessonId);

				const { _visualState: moduleState } = Progress.getModuleStateById(moduleId);
				if (lessonState < 2) {
					if (moduleState < 2) {
						const {
							lessons,
							modules,
							localProgress,
							getModuleStateById,
						} = Progress;
						// Get the active module id
						const { id: activeModuleId, name: moduleName } =
							modules.find(({ id }) => getModuleStateById(id)._visualState > 1)
							|| modules[0].id;
						const activeLessonId = localProgress.length ?
							localProgress[localProgress.length - 1].lessonID :
							lessons[0].id;
						this.setActiveLesson(activeLessonId, activeModuleId);
						browserHistory.replace(`/learn/${courseName}/${activeModuleId}/${toSeoFrendly(moduleName, 100)}/${activeLessonId}/${toSeoFrendly(this.props.activeLesson.name, 100)}/${this.props.activeQuiz.number}`);
					} else {
						const { localProgress } = Progress;
						const activeLessonId = localProgress[localProgress.length - 1].lessonID;
						this.setActiveLesson(activeLessonId, moduleId);
						browserHistory.replace(`/learn/${courseName}/${moduleId}/${toSeoFrendly(moduleName, 100)}/${activeLessonId}/${toSeoFrendly(this.props.activeLesson.name, 100)}/${this.props.activeQuiz.number}`);
					}
				} else {
					this.setActiveLesson(lessonId, moduleId);
				}
			} catch (e) {
				console.log(e);
			}
		} else if (isShortcut) {
			const activeQuiz = shortcutLesson.quizzes[0];
			selectQuiz({ id: activeQuiz.id, number: activeQuiz.number, isText: false });
		}
		const { count } =
			await Service.request('Discussion/GetLessonCommentCount', { quizId: this.props.activeQuiz.id, type: this.props.activeQuiz.isText ? 1 : 3 });
		this.setState({ commentsCount: count, loading: false });
		document.title = `${this.props.activeLesson.name}`;
	}

	setActiveLesson = (lessonId, moduleId) => {
		const {
			lessons,
			selectLesson,
			selectModule,
		} = this.props;
		selectLesson(lessonId);
		selectModule(moduleId);
		const lesson = lessons[lessonId];
		this.getActiveQuiz(lesson);
	}

	generateTimeline = (quizzes, activeQuiz) => {
		const timeline = [];
		const lesson = !this.props.isShortcut ? this.props.activeLesson : this.props.shortcutLesson;
		const progress = Progress.getLessonProgress(lesson.id);
		let activeQuizIndex = 0;
		let isLessonCompleted = false;

		if (progress != null) {
			isLessonCompleted = progress.isCompleted || false;
			let incrementQuzId = false;
			for (let i = 0; i < progress.quizzes.length; i++) {
				if (progress.quizzes[i].isCompleted) {
					activeQuizIndex = i;
					incrementQuzId = true;
				}
			}
			if (incrementQuzId) {
				activeQuizIndex++;
			}
		}

		const progressState = ProgressState;
		const isCheckpoint = lesson.type === LessonType.Checkpoint;
		// let currentIndex = 0;

		quizzes.forEach((quiz, index) => {
			const isCompleted = (isLessonCompleted || index <= activeQuizIndex) && !this.props.isShortcut;
			const isCurrent = quizzes[index].id === activeQuiz.id;
			// if (isCurrent) currentIndex = (isCheckpoint ? index * 2 : index);

			if (isCheckpoint) {
				timeline.push({
					lessonId: lesson.id,
					quizId: quiz.id,
					key: `text${quiz.id}`,
					isText: true,
					index,
					number: (index * 2) + 1,
					state: (isCurrent ? progressState.Active : (isCompleted ? progressState.Normal : progressState.Disabled)),
				});
			}
			timeline.push({
				lessonId: lesson.id,
				quizId: quiz.id,
				key: `quiz${quiz.id}`,
				isText: false,
				index,
				number: isCheckpoint ? (index + 1) * 2 : index + 1,
				state: (isCurrent ? progressState.Active : (isCompleted ? progressState.Normal : progressState.Disabled)),
			});
		});

		return timeline.map((item, index) => {
			const quizNumber = (parseInt(this.props.activeQuiz.number, 10) - 1);
			const isActive = quizNumber === index;
			return (
				<Step
					value={index}
					key={item.key}
					onClick={() => this.loadLessonLink(item.quizId, item.number, item.isText, item.state)}
				>
					<StepLabel
						icon={
							<StepIcon
								text={index + 1}
								active={isActive}
								completed={quizNumber > index}
							/>
						}
						style={{
							paddingLeft: index === 0 ? 0 : 14,
							paddingRight: index === timeline.length - 1 ? 0 : 14,
						}}
					/>
				</Step>
			);
		});
	}

	loadLessonLink = async (quizId, number, isText, state) => {
		if (state === ProgressState.Disabled) {
			this.setState(this.state);
			return;
		}
		const { count } =
			await Service.request('Discussion/GetLessonCommentCount', { quizId, type: isText ? 1 : 3 });
		this.setState({ commentsCount: count, commentsOpened: false });
		this.props.selectQuiz(Object.assign({}, { id: quizId }, { number }, { isText }));

		if (this.props.isShortcut) {
			const pathName = this.props.location.pathname;
			const newPathName = pathName.substr(0, pathName.length - 1) + number;
			browserHistory.push(newPathName);
		} else {
			const lesson = this.props.activeLesson;
			browserHistory.push(`/learn/${this.props.params.courseName}/${this.props.params.moduleId}/${this.props.params.moduleName}/${lesson.id}/${toSeoFrendly(lesson.name, 100)}/${number}`);
		}
	}

	getActiveQuiz = (lesson) => {
		const { quizzes } = lesson;
		const currentNumber = parseInt(this.props.params.quizNumber || 1, 10);
		const activeQuiz = {};
		const isCheckpoint = lesson.type === LessonType.Checkpoint;
		for (let i = 0; i < quizzes.length; i++) {
			if (isCheckpoint) {
				if ((i * 2) + 1 === currentNumber) {
					Object.assign(
						activeQuiz,
						{ id: quizzes[i].id }, { number: currentNumber }, { isText: true },
					);
				}
			}
			if ((isCheckpoint ? (i + 1) * 2 : i + 1) === currentNumber) {
				Object.assign(
					activeQuiz,
					{ id: quizzes[i].id }, { number: currentNumber }, { isText: false },
				);
			}
		}

		this.props.selectQuiz(activeQuiz);
	}

	openComments = () => {
		this.setState({ commentsOpened: true });
	}

	render() {
		const {
			course,
			isLoaded,
			activeQuiz,
			activeLesson,
			activeModule,
		} = this.props;
		const { loading, commentsCount, commentsOpened } = this.state;

		if (loading || (!isLoaded && !this.props.isShortcut) ||
			(this.props.isShortcut && !activeQuiz) ||
			(this.props.params.quizNumber && !this.props.activeQuiz)) {
			return <div>Loading...</div>;
		}

		const quizzes = !this.props.isShortcut ? activeLesson.quizzes : this.props.shortcutLesson.quizzes;

		const childrenWithProps = React.Children.map(
			this.props.children,
			child => React.cloneElement(child, {
				loadLessonLink: this.loadLessonLink,
				openComments: this.openComments,
				updateShorctutData: this.props.updateShorctutData,
				exitShortcut: this.props.exitShortcut,
				isShortcut: this.props.isShortcut,
				shortcutLesson: this.props.shortcutLesson,
				shortcutLives: this.props.shortcutLives,
				isShortcutCorrectCounts: this.props.isShortcutCorrectCounts,
			}),
		);

		return (
			<Layout>
				<Paper className="quiz-container" style={{ padding: 15 }}>
					<div className="lesson-breadcrumbs">
						{ course.name } &gt; { activeModule.name } &gt; { activeLesson.name }
					</div>
					<Stepper activeStep={parseInt(this.props.activeQuiz.number, 10) - 1}>
						{this.generateTimeline(quizzes, activeQuiz)}
					</Stepper>
					{childrenWithProps}
					{((!this.props.isShortcut && commentsOpened) || activeQuiz.isText) &&
						<Comments
							id={activeQuiz.id}
							commentsType="lesson"
							type={activeQuiz.isText ? 1 : 3}
							commentsCount={commentsCount}
							closeComments={this.closeComments}
						/>
					}
				</Paper>
			</Layout>
		);
	}
}

export default QuizManager;
