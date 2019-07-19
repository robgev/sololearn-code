// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import { LayoutWithSidebar, EmptyCard } from 'components/molecules';

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
import { getCourseByAlias } from 'reducers/courses.reducer';

// Utils
import Progress, { ProgressState } from 'api/progress';
import Service from 'api/service';
import { toSeoFriendly } from 'utils';

// Additional data and components
import Comments from 'containers/Comments/CommentsBase';
import { Link, Container, PaperContainer } from 'components/atoms';

import StepIcon from './StepIcon';
import { UserProgressToolbar } from './components';
import Quiz from './Quiz';

export const LessonType = {
	Checkpoint: 0,
	Quiz: 1,
};

const isQuizCompleted = ({ quizID, lessonProgress }) => {
	if (lessonProgress === null) return false;
	if (lessonProgress.isCompleted === true) {
		return true;
	}
	const progress = lessonProgress.quizzes.find(el => el.quizID === quizID);
	return progress !== undefined && progress.isCompleted;
};

const mapStateToProps = (state, ownProps) => ({
	isLoaded: isLoaded(state, 'quizzes'),
	course: getCourseByAlias(state, ownProps.alias),
	lessons: state.lessonsMapping,
	activeQuiz: state.activeQuiz,
	lesson: getLessonByName(state, ownProps.lessonName),
	module: getModuleByName(state, ownProps.moduleName),
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	activeLesson: !state.course ? null : state.lessonsMapping[state.activeLessonId],
});

const mapDispatchToProps = {
	loadCourseInternal, selectLesson, selectModule, selectQuiz,
};

@connect(mapStateToProps, mapDispatchToProps)
class QuizManager extends Component {
	_isMounted = false;
	getCommentsPromise = null;

	state = {
		commentsCount: null,
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

		if (!isLoaded) {
			this.setState({ loading: true });
			await loadCourseInternal(course.id);
			this.setState({ loading: false });
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

				moduleName, lessonName, alias,
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
					browserHistory.replace(`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(lessonName)}/${this.props.activeQuiz.number}`);
				} else {
					const { localProgress } = Progress;
					const activeLessonId = localProgress[localProgress.length - 1].lessonID;
					this.setActiveLesson(activeLessonId, moduleId);
					browserHistory.replace(`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(lessonName)}/${this.props.activeQuiz.number}`);
				}
			} else {
				this.setActiveLesson(lessonId, moduleId);
			}
			this.getCommentsCount({
				quizId: this.props.activeQuiz.id,
				type: this.props.activeQuiz.isText ? 1 : 3,
			});
			if (this._isMounted) {
				document.title = `${this.props.activeLesson.name}`;
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.timeline.length && nextProps.quizNumber !== this.props.quizNumber) {
			const number = parseInt(nextProps.quizNumber, 10);
			const {
				quizId, isText, state,
			} = this.timeline.find(q => q.number === number);
			this.loadLessonLink(quizId, number, isText, state);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getCommentsCount = async ({ quizId, type }) => {
		this.setState({ commentsCount: null });
		const getCommentsPromise = Service.request('Discussion/GetLessonCommentCount', {
			quizId, type,
		});
		this.getCommentsPromise = getCommentsPromise;
		const { count } = await getCommentsPromise;
		if (getCommentsPromise === this.getCommentsPromise) {
			if (this._isMounted) {
				if (type === 3) {
					this.setState({ commentsOpened: false });
				} else {
					this.setState({ commentsOpened: true });
				}
				this.setState({ commentsCount: count });
			}
		}
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

	getLastUnlockedQuiz = (quizNumber, timeline) => {
		let lastUnlockedQuiz = quizNumber - 1;
		while (lastUnlockedQuiz >= 0 && !timeline[lastUnlockedQuiz].isCompleted) {
			lastUnlockedQuiz--;
		}
		lastUnlockedQuiz += 2;

		return lastUnlockedQuiz;
		/* let lastUnlockedQuiz = quizNumber;

		while (lastUnlockedQuiz > 0 && !timeline[lastUnlockedQuiz].isCompleted) {
			lastUnlockedQuiz--;
		}
		if (lastUnlockedQuiz !== 0 && lastUnlockedQuiz < timeline.length - 1) {
			lastUnlockedQuiz++;
		}
		while (timeline[lastUnlockedQuiz].isText && lastUnlockedQuiz !== quizNumber) {
			lastUnlockedQuiz++;
		}
		return lastUnlockedQuiz; */
	}

	generateTimeline = (quizzes, activeQuiz) => {
		const timeline = [];
		const lesson = this.props.activeLesson;
		/* if (lesson.type !== LessonType.Checkpoint) {
			return null;
		} */
		const progress = Progress.getLessonProgress(lesson.id);
		let activeQuizIndex = 0;
		let isLessonCompleted = false;

		if (progress != null) {
			const progressQuizes = [];
			// match progress.quizzes order with quizzes order
			quizzes.forEach(({ id }) => {
				const progressItem = progress.quizzes.find(q => q.quizID === id);
				if (progressItem) {
					progressQuizes.push(progressItem);
				}
			});

			isLessonCompleted = progress.isCompleted || false;
			const incrementQuzId = false;
			for (let i = 0; i < progressQuizes.length; i++) {
				if (progressQuizes[i].isCompleted) {
					activeQuizIndex = i + 1;
				}
			}
		}
		const isCheckpoint = lesson.type === LessonType.Checkpoint;

		quizzes.forEach((quiz, index) => {
			const isCompleted = (isLessonCompleted || index <= activeQuizIndex);
			const isCurrent = quizzes[index].id === activeQuiz.id;
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
		return timeline;
	}

	getProgress = (quizzes, activeQuiz) => {
		const timeline = this.generateTimeline(quizzes, activeQuiz);
		const isModuleQuiz = this.props.activeLesson.type !== LessonType.Checkpoint;
		const quizNumber = (parseInt(this.props.activeQuiz.number, 10) - 1);
		if (!isModuleQuiz && timeline.length < 3) {
			return null;
		}
		const count = isModuleQuiz ? timeline.length : timeline.length / 2;
		const activeQuizId = timeline[quizNumber].quizId;

		const lastActive = this.getLastUnlockedQuiz(timeline.length, timeline);

		const percent = isModuleQuiz
			? (100 * ((lastActive - 1) / (count - 1)))
			: (100 * (Math.floor(lastActive / 2) / (count - 1)));
		return (
			<div
				style={{
					margin: '20px auto',
					width: `${((count * 3) + ((count - 1) * 5))}%`,
				}}
			>
				<ProgressBar
					height={7}
					percent={percent}
					filledBackground="#8BC34A"
				>
					{
						timeline
							.filter(el => el.isText || isModuleQuiz)
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
			moduleName,
			alias,
			activeLesson,
		} = this.props;
		this.getCommentsCount({ quizId, type: isText ? 1 : 3 });
		this.props.selectQuiz({ id: quizId, number, isText });
		browserHistory.push(`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(activeLesson.name)}/${number}`);
	}

	getActiveQuiz = (lesson) => {
		const { quizzes } = lesson;
		const currentNumber = parseInt(this.props.quizNumber || quizzes.length, 10);
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

		const timeline = this.generateTimeline(quizzes, activeQuiz);
		const quizNumber = Math.min(
			parseInt(this.props.quizNumber || timeline.length - 1, 10),
			timeline.length - 1,
		);
		let lastUnlockedQuiz = this.getLastUnlockedQuiz(quizNumber, timeline);
		if (lastUnlockedQuiz >= timeline.length) {
			lastUnlockedQuiz = 1;
		}
		if (!this.props.quizNumber || lastUnlockedQuiz < this.props.quizNumber) {
			const {
				moduleName, lessonName, alias,
			} = this.props;
			browserHistory.replace(`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(lessonName)}/${lastUnlockedQuiz || 1}`);
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

			moduleName,
			alias,
		} = this.props;
		const { loading, commentsCount, commentsOpened } = this.state;

		if (loading || (!isLoaded) ||
			(!activeQuiz) ||
			(activeQuiz.number === undefined) ||
			(this.props.quizNumber && !this.props.activeQuiz)) {
			return (
				<LayoutWithSidebar
					sidebar={<UserProgressToolbar />}
				>
					<EmptyCard loading paper />
				</LayoutWithSidebar>
			);
		}

		const { quizzes, tags } = activeLesson;

		// const childrenWithProps = React.Children.map(
		// 	this.props.children,
		// 	child => React.cloneElement(child, {
		// 		loadLessonLink: this.loadLessonLink,
		// 		openComments: this.openComments,
		// 		activeLesson,
		// 	}),
		// );

		const childrenWithProps = (<Quiz
			loadLessonLink={this.loadLessonLink}
			openComments={this.openComments}
			activeLesson={activeLesson}
			alias={alias}
			moduleName={moduleName}
		/>);

		return (
			<LayoutWithSidebar
				sidebar={<UserProgressToolbar />}
			>
				<PaperContainer className="quiz-container">
					<Container style={{ padding: 15 }}>
						<Container className="lesson-breadcrumbs">
							<Link to={`/learn/${toSeoFriendly(alias)}`}>
								{course.name} &gt; {' '}
							</Link>
							<Link to={`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}`}>
								{activeModule.name} &gt; {' '}
							</Link>
							<Link to={`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(activeLesson.name, 100)}/1`}>
								{activeLesson.name}
							</Link>
						</Container>
						{this.getProgress(quizzes, activeQuiz)}
						{childrenWithProps}
						<Link to={{ pathname: '/discuss', query: { query: tags !== null ? tags : course.language } }}>Q&A</Link>
					</Container>

				</PaperContainer>
				{commentsCount !== null && commentsOpened ?
					<Comments
						key={`${activeQuiz.id}${activeQuiz.isText}`}
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
