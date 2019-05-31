// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { ProgressState } from 'api/progress';
import { getCourseByAlias } from 'reducers/courses.reducer';

// Redux modules
import {
	selectQuiz,
	selectLesson,
	selectModuleByName,
	loadCourseInternal,
} from 'actions/learn';
import { isLoaded } from 'reducers';

import { toSeoFriendly } from 'utils';
import { LayoutWithSidebar, EmptyCard } from 'components/molecules';
import { Container, Link } from 'components/atoms';

import './Lessons.scss';

import { LessonTiles, UserProgressToolbar } from './components';
import { LessonType } from './QuizManager';

const mapStateToProps = (state, ownProps) => ({
	isLoaded: isLoaded(state, 'lessons'),
	course: getCourseByAlias(state, ownProps.alias),
	modules: state.modulesMapping,
	activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
	lessons: state.lessonsMapping,
});

const mapDispatchToProps = {
	loadCourseInternal,
	selectLesson,
	selectModuleByName,
	selectQuiz,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Lessons extends Component {
	componentWillMount() {
		if (!this.props.isLoaded) {
			this.props.loadCourseInternal(this.props.course.id).then(() => {
				this.props.selectModuleByName(this.props.moduleName);
			});
		}
		document.title = `${this.props.activeModule ? this.props.activeModule.name : 'Learn'}`;
		ReactGA.ga('send', 'screenView', { screenName: 'Lessons Page' });
	}

	handleClick = (lessonId, lessonState, lessonName) => {
		const {
			alias,
			moduleName,
		} = this.props;
		if (lessonState.visualState === ProgressState.Disabled) {
			return;
		}
		this.props.selectLesson(lessonId, lessonState);
		this.props.selectQuiz(this.getActiveQuiz(this.props.lessons[lessonId]));
		browserHistory.push(`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}/${toSeoFriendly(lessonName)}/`);
	}

	getActiveQuiz = (lesson) => {
		const { quizzes } = lesson;
		const currentNumber = 1;
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
			alias,
			moduleName,
		} = this.props;

		if (!isLoaded || !activeModule) {
			return (
				<LayoutWithSidebar
					sidebar={<UserProgressToolbar />}
				>
					<EmptyCard loading />
				</LayoutWithSidebar>
			);
		}

		const { lessons, name } = activeModule;

		return (
			<LayoutWithSidebar
				sidebar={<UserProgressToolbar />}
			>
				<Container className="lessons-container">
					<Container className="lesson-breadcrumbs">
						<Link className="hoverable" to={`/learn/${toSeoFriendly(alias)}`}>
							{course.name}
						</Link> &gt;
						<Link className="hoverable" to={`/learn/${toSeoFriendly(alias)}/${toSeoFriendly(moduleName)}`}>
							{name}
						</Link>
					</Container>
					<LessonTiles
						t={t}
						lessons={lessons}
						onItemClick={this.handleClick}
					/>
				</Container>
			</LayoutWithSidebar>
		);
	}
}

export default Lessons;
