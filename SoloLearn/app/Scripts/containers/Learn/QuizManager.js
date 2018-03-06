// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';

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

export const LessonType = {
	Checkpoint: 0,
	Quiz: 1,
};

class QuizManager extends Component {
	state = {
		commentsOpened: false,
	}

	async componentWillMount() {
		const {
			lessons,
			params,
			isLoaded,
			isShortcut,
			selectQuiz,
			selectLesson,
			selectModule,
			shortcutLesson,
			loadCourseInternal,
		} = this.props;
		if (!isShortcut) {
			Service.request('/AddLessonImpression', { lessonId: params.lessonId });
		}
		if (!isLoaded && !isShortcut) {
			try {
				await loadCourseInternal();
				selectModule(parseInt(params.moduleId, 10));
				selectLesson(parseInt(params.lessonId, 10));
				const lesson = lessons[params.lessonId];
				this.getActiveQuiz(lesson);
			} catch (e) {
				console.log(e);
			}
		} else if (isShortcut) {
			const activeQuiz = shortcutLesson.quizzes[0];
			selectQuiz({ id: activeQuiz.id, number: activeQuiz.number, isText: false });
		}
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

		return timeline.map((item, index) => (
			<Tab
				value={index}
				key={item.key}
				label={item.quizId}
				className={`${ProgressState.getName(item.state)} timeline-item`}
				onClick={() => this.loadLessonLink(item.quizId, item.number, item.isText, item.state)}
			/>
		));
	}

	loadLessonLink = (quizId, number, isText, state) => {
		if (state === ProgressState.Disabled) {
			this.setState(this.state);
			return;
		}
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
		const currentNumber = this.props.params.quizNumber;
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

	closeComments = () => {
		this.setState({ commentsOpened: false });
	}

	render() {
		const { isLoaded, activeLesson, activeQuiz } = this.props;

		if ((!isLoaded && !this.props.isShortcut) || (this.props.isShortcut && !activeQuiz)) {
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
				<Tabs className="quizTimeline" value={parseInt(this.props.activeQuiz.number, 10) - 1}>
					{this.generateTimeline(quizzes, activeQuiz)}
				</Tabs>
				{childrenWithProps}
				{(!this.props.isShortcut && this.state.commentsOpened) &&
					<Comments
						id={activeQuiz.id}
						commentsType="lesson"
						type={activeQuiz.isText ? 1 : 3}
						closeComments={this.closeComments}
						commentsOpened={this.state.commentsOpened}
					/>
				}
			</Layout>
		);
	}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(QuizManager);
