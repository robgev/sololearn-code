// React modules
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { LayoutWithSidebar, EmptyCard } from 'components/molecules';

// Material UI components
import Paper from 'material-ui/Paper';

import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';

// Redux modules
import { isLoaded } from 'reducers';
import {
	selectQuiz,
	selectLesson,
	selectModule,
	loadCourseInternal,
} from 'actions/learn';
import { getModuleByName } from 'reducers/reducer_modules';
import { getLessonByName } from 'reducers/reducer_lessons';
import { getCourseByCourseName } from 'reducers/courses.reducer';

// Utils
import Progress, { ProgressState } from 'api/progress';
import Service from 'api/service';
import { toSeoFriendly } from 'utils';

// Additional data and components
import Comments from 'containers/Comments/CommentsBase';

import StepIcon from './StepIcon';
import { UserProgressToolbar } from './components';

export const LessonType = {
	Checkpoint: 0,
	Quiz: 1,
};

const isQuizCompleted = ({ quizID, lessonProgress }) => {
	if (lessonProgress === null) return false;
	const progress = lessonProgress.quizzes.find(el => el.quizID === quizID);
	return progress !== undefined && progress.isCompleted;
};

const mapStateToProps = (state, ownProps) => ({
	isLoaded: isLoaded(state, 'quizzes'),
	course: getCourseByCourseName(state, ownProps.params.courseName),
	lessons: state.lessonsMapping,
	activeQuiz: state.activeQuiz,
	lesson: getLessonByName(state, ownProps.params.lessonName),
	module: getModuleByName(state, ownProps.params.moduleName),
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	activeLesson: !state.course ? null : state.lessonsMapping[state.activeLessonId],
});

const mapDispatchToProps = {
	loadCourseInternal, selectLesson, selectModule, selectQuiz,
};

@connect(mapStateToProps, mapDispatchToProps)
class QuizManager extends Component {
	_isMounted = false;

	state = {
		commentsCount: 0,
		commentsOpened: false,
	}

	async componentDidMount() {
		this._isMounted = true;
		this.timeline = [];
		const {
			isLoaded,
			loadCourseInternal,
			course,
		} = this.props;


		this.setState({ loading: true });

		if (!isLoaded) {
			await loadCourseInternal(course.id);
		}
		if (this._isMounted) {
			const lessonId = this.props.lesson.id;
			Service.request('AddLessonImpression', { lessonId });
			const moduleId = this.props.module.id;
			// As always, there are <censored> mappings. This one being:
			// 1 - Module is disabled
			// 2 - Module is active
			// 3 - Module is finished
			const {
				params: {
					courseName, moduleName, lessonName,
				},
			} = this.props;
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
					const { id: activeModuleId } =
						modules.find(({ id }) => getModuleStateById(id)._visualState > 1)
						|| modules[0].id;
					const activeLessonId = localProgress.length ?
						localProgress[localProgress.length - 1].lessonID :
						lessons[0].id;
					this.setActiveLesson(activeLessonId, activeModuleId);
					browserHistory.replace(`/learn/course/${courseName}/${moduleName}/${toSeoFriendly(lessonName)}/${this.props.activeQuiz.number}`);
				} else {
					const { localProgress } = Progress;
					const activeLessonId = localProgress[localProgress.length - 1].lessonID;
					this.setActiveLesson(activeLessonId, moduleId);
					browserHistory.replace(`/learn/course/${courseName}/${moduleName}/${toSeoFriendly(lessonName)}/${this.props.activeQuiz.number}`);
				}
			} else {
				this.setActiveLesson(lessonId, moduleId);
			}
			const { count } =
				await Service.request('Discussion/GetLessonCommentCount', { quizId: this.props.activeQuiz.id, type: this.props.activeQuiz.isText ? 1 : 3 });
			if (this._isMounted) {
				this.setState({ commentsCount: count, loading: false });
				document.title = `${this.props.activeLesson.name}`;
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.timeline.length && nextProps.params.quizNumber !== this.props.params.quizNumber) {
			const number = parseInt(nextProps.params.quizNumber, 10);
			const {
				quizId, isText, state,
			} = this.timeline.find(q => q.number === number);
			this.loadLessonLink(quizId, number, isText, state);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
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
		const lesson = this.props.activeLesson;
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
		const isCheckpoint = lesson.type === LessonType.Checkpoint;
		// let currentIndex = 0;

		quizzes.forEach((quiz, index) => {
			const isCompleted = (isLessonCompleted || index <= activeQuizIndex);
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
					state: isCurrent
						? ProgressState.Active
						: isCompleted
							? ProgressState.Normal
							: ProgressState.Disabled,
					isCompleted: isQuizCompleted({ quizID: quiz.id, lessonProgress: progress }),
				});
			}
			timeline.push({
				lessonId: lesson.id,
				quizId: quiz.id,
				key: `quiz${quiz.id}`,
				isText: false,
				index,
				number: isCheckpoint ? (index + 1) * 2 : index + 1,
				state: isCurrent
					? ProgressState.Active
					: isCompleted
						? ProgressState.Normal
						: ProgressState.Disabled,
				isCompleted: isQuizCompleted({ quizID: quiz.id, lessonProgress: progress }),
			});
		});
		this.timeline = timeline;
		const quizNumber = (parseInt(this.props.activeQuiz.number, 10) - 1);
		const activeQuizId = timeline[quizNumber].quizId;
		if (timeline.length < 3) {
			return null;
		}
		const count = timeline.length / 2;
		return (
			<div
				style={{
					margin: '20px auto',
					width: `${((count * 3) + ((count - 1) * 5))}%`,
				}}
			>
				<ProgressBar
					height={7}
					percent={100 * (Math.floor(quizNumber / 2) / (count - 1))}
					filledBackground="#8BC34A"
				>
					{
						timeline
							.filter(el => el.isText)
							.map((item, index) => {
								const isActive = item.quizId === activeQuizId;
								return (
									<Step>
										{() => (
											<div
												key={item.key}
												tabIndex={0}
												role="button"
												onClick={() =>
													this.loadLessonLink(item.quizId, item.number, item.isText, item.state)}
												style={{
													backgroundColor: 'white',
													cursor: 'pointer',
												}}
											>
												<StepIcon
													key={item.key}
													text={index + 1}
													active={isActive}
													completed={item.isCompleted && item.state !== ProgressState.Active}
												/>
											</div>
										)
										}
									</Step>
								);
							})
					}
				</ProgressBar>
			</div>
		);
	}

	loadLessonLink = (quizId, number, isText, state) => {
		if (state === ProgressState.Disabled) {
			this.setState(this.state);
			return;
		}
		const {
			params: {
				courseName,
				moduleName,
			},
			activeLesson,
		} = this.props;
		Service.request('Discussion/GetLessonCommentCount', { quizId, type: isText ? 1 : 3 })
			.then(({ count }) => {
				this.setState({ commentsCount: count, commentsOpened: false });
			});
		browserHistory.push(`/learn/course/${courseName}/${moduleName}/${toSeoFriendly(activeLesson.name)}/${number}`);
		this.props.selectQuiz({ id: quizId, number, isText });
	}

	getActiveQuiz = (lesson) => {
		const { quizzes } = lesson;
		const currentNumber = parseInt(this.props.params.quizNumber || 1, 10);
		const activeQuiz = {};
		const isCheckpoint = lesson.type === LessonType.Checkpoint;
		for (let i = 0; i < quizzes.length; i += 1) {
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
		if (!this.props.params.quizNumber) {
			browserHistory.replace(`${this.props.location.pathname}/${currentNumber}`);
		}
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
			params: {
				courseName,
				moduleName,
			},
		} = this.props;
		const { loading, commentsCount, commentsOpened } = this.state;

		if (loading || (!isLoaded) ||
			(!activeQuiz) ||
			(this.props.params.quizNumber && !this.props.activeQuiz)) {
			return 	<LayoutWithSidebar
						sidebar={<UserProgressToolbar />}
					>
						<EmptyCard loading paper />
					</LayoutWithSidebar>
		}

		const { quizzes, tags } = activeLesson;

		const childrenWithProps = React.Children.map(
			this.props.children,
			child => React.cloneElement(child, {
				loadLessonLink: this.loadLessonLink,
				openComments: this.openComments,
				activeLesson,
			}),
		);

		return (
			<LayoutWithSidebar
				sidebar={<UserProgressToolbar />}
			>
				<Paper className="quiz-container">
					<div style={{ padding: 15 }}>
						<div className="lesson-breadcrumbs">
							<Link className="hoverable" to={`/learn/course/${courseName}`}>
								{course.name} &gt; {' '}
							</Link>
							<Link className="hoverable" to={`/learn/course/${courseName}/${moduleName}`}>
								{activeModule.name} &gt; {' '}
							</Link>
							<Link className="hoverable" to={`/learn/course/${courseName}/${moduleName}/${toSeoFriendly(activeLesson.name, 100)}/1`}>
								{activeLesson.name}
							</Link>
						</div>
						{this.generateTimeline(quizzes, activeQuiz)}
						{childrenWithProps}
						<Link to={{ pathname: '/discuss', query: { query: tags !== null ? tags : course.language } }}>Q&A</Link>
					</div>
					

				</Paper>
				{commentsOpened || activeQuiz.isText ?
						<Comments
							id={activeQuiz.id}
							commentsType="lesson"
							type={activeQuiz.isText ? 1 : 3}
							commentsCount={commentsCount}
						/> : null
					}
			</LayoutWithSidebar>
		);
	}
}

export default QuizManager;
