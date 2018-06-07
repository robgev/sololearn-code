// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
	CSSTransition,
	TransitionGroup,
} from 'react-transition-group';

// Marterial UI components
import Paper from 'material-ui/Paper';
import Progress, { ProgressState } from 'api/progress';

// Redux modules
import {
	selectQuiz,
	selectLesson,
	selectModule,
	loadCourseInternal,
} from 'actions/learn';
import { isLoaded } from 'reducers';

// Utils
import { toSeoFrendly } from 'utils';
import Layout from 'components/Layouts/GeneralLayout';

import 'styles/Learn/Lessons.scss';

import { LessonType } from './QuizManager';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'lessons'),
	course: state.course,
	modules: state.modulesMapping,
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	lessons: state.lessonsMapping,
});

const mapDispatchToProps = {
	loadCourseInternal,
	selectLesson,
	selectModule,
	selectQuiz,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Lessons extends Component {
	componentWillMount() {
		if (!this.props.isLoaded) {
			this.props.loadCourseInternal().then(() => {
				this.props.selectModule(parseInt(this.props.params.moduleId));
			}).catch((error) => {
				console.log(error);
			});
		}
		document.title = `${this.props.activeModule ? this.props.activeModule.name : 'Learn'}`;
		ReactGA.ga('send', 'screenView', { screenName: 'Lessons Page' });
	}

	handleClick = (lessonId, lessonState, url) => {
		if (lessonState.visualState == ProgressState.Disabled) {
			return;
		}
		this.props.selectLesson(lessonId, lessonState);
		this.props.selectQuiz(this.getActiveQuiz(this.props.lessons[lessonId]));
		browserHistory.push(url);
	}
	getActiveQuiz = (lesson) => {
		const quizzes = lesson.quizzes;
		const currentNumber = this.props.params.quizNumber || 1;
		const activeQuiz = {};
		const isCheckpoint = lesson.type == LessonType.Checkpoint;
		for (let i = 0; i < quizzes.length; i++) {
			if (isCheckpoint) {
				if ((i * 2) + 1 == currentNumber) {
					Object.assign(activeQuiz, { id: quizzes[i].id }, { number: currentNumber }, { isText: true });
				}
			}
			if ((isCheckpoint ? (i + 1) * 2 : i + 1) == currentNumber) {
				Object.assign(activeQuiz, { id: quizzes[i].id }, { number: currentNumber }, { isText: false });
			}
		}
		return activeQuiz;
	}

	render() {
		const {
			t, course, modules, activeModule, isLoaded,
		} = this.props;

		if (!isLoaded || !activeModule) {
			return <div>Loading...</div>;
		}

		const { lessons } = activeModule;

		return (
			<Layout>
				<TransitionGroup
					appear
				>
					{lessons.map((lesson, index) => {
						const lessonState = Progress.getLessonState(lesson);
						const isDisabled = lessonState.visualState === ProgressState.Disabled;

						return (
							<CSSTransition
								key={lesson.id}
								classNames="lesssons-in"
								timeout={150 + (index * 30)}
							>
								<div
									tabIndex={0}
									role="button"
									key={lesson.id}
									style={{ animationDelay: `${index * 30}ms` }}
									className={`lesson-item ${lessonState.stateClass}`}
									onClick={() => this.handleClick(lesson.id, lessonState, `/learn/${this.props.params.courseName}/${this.props.params.moduleId}/${this.props.params.moduleName}/${lesson.id}/${toSeoFrendly(lesson.name, 100)}/1`)}
								>
									<Paper
										key={lesson.id}
										zDepth={isDisabled ? 0 : 1}
										className={`lesson ${isDisabled ? 'disabled' : ''}`}
									>
										<div className="number">{`${index + 1}/${lessons.length}`}</div>
										<div className="name">{lesson.name}</div>
										<div className={`info ${lessonState.stateClass}`}>
											<span>{lesson.quizzes.length} {t('learn.questions-format')}</span>
										</div>
									</Paper>
								</div>
							</CSSTransition>
						);
					})
					}
				</TransitionGroup>
			</Layout>
		);
	}
}

export default Lessons;
