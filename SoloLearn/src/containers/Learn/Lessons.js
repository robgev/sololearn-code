// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// Marterial UI components
import Paper from 'material-ui/Paper';
import { ProgressState } from 'api/progress';

// Redux modules
import {
// selectQuiz,
// selectLesson,
// selectModule,
// loadCourseInternal,
} from 'actions/learn';
import { isLoaded } from 'reducers';

import { toSeoFriendly } from 'utils';
import Layout from 'components/Layouts/GeneralLayout';

import 'styles/Learn/Lessons.scss';

import { LessonType } from './QuizManager';
import LessonTiles from './LessonTiles';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'lessons'),
	course: state.course,
	modules: state.modulesMapping,
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	lessons: state.lessonsMapping,
});

const mapDispatchToProps = {
	// loadCourseInternal,
	// selectLesson,
	// selectModule,
	// selectQuiz,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Lessons extends Component {
	componentWillMount() {
		if (!this.props.isLoaded) {
			this.props.loadCourseInternal().then(() => {
				this.props.selectModule(parseInt(this.props.params.moduleId, 10));
			}).catch((error) => {
				console.log(error);
			});
		}
		document.title = `${this.props.activeModule ? this.props.activeModule.name : 'Learn'}`;
		ReactGA.ga('send', 'screenView', { screenName: 'Lessons Page' });
	}

	handleClick = (lessonId, lessonState, lessonName) => {
		const {
			params: {
				courseName,
				courseId,
				moduleId,
				moduleName,
				itemType,
			},
		} = this.props;
		if (lessonState.visualState === ProgressState.Disabled) {
			return;
		}
		this.props.selectLesson(lessonId, lessonState);
		this.props.selectQuiz(this.getActiveQuiz(this.props.lessons[lessonId]));
		browserHistory.push(`/learn/course/${courseName}/${moduleName}/${lessonName}`);
	}

	getActiveQuiz = (lesson) => {
		const { quizzes } = lesson;
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
			t,
			course,
			isLoaded,
			activeModule,
			params: {
				courseName,
				courseId,
				moduleId,
				moduleName,
				itemType,
			},
		} = this.props;

		if (!isLoaded || !activeModule) {
			return <div>Loading...</div>;
		}

		const { lessons, name } = activeModule;

		return (
			<Layout>
				<div className="lessons-container">
					<div className="lesson-breadcrumbs">
						<Link className="hoverable" to={`/learn/course/${courseName}`}>
							{course.name}
						</Link> &gt;
						<Link className="hoverable" to={`/learn/course/${courseName}/${moduleName}`}>
							{name}
						</Link>
					</div>
					<LessonTiles
						t={t}
						lessons={lessons}
						onItemClick={this.handleClick}
					/>
				</div>
			</Layout>
		);
	}
}

export default Lessons;
