// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

import { LessonType } from './QuizManager';

// i18n
import { translate } from 'react-i18next';

const styles = {

	lessonWrapper: {
		display: 'inline-block',
		margin: '20px 0 0 0',
		cursor: 'pointer',
	},

	lesson: {
		base: {
			position: 'relative',
			display: 'inline-block',
			height: '155px',
			width: '155px',
			overflow: 'hidden',
			margin: '4px',
		},

		disabled: {
			backgroundColor: '#e4e4e4',
		},
	},

	lessonNumber: {
		padding: '4px',
		fontSize: '12px',
		float: 'right',
		color: '#777',
	},

	lessonName: {
		padding: '20px 10px',
		textAlign: 'left',
		height: '115px',
		color: '#565656',
		fontSize: '15px',
	},

	lessonInfo: {
		base: {
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			padding: '10px',
			fontSize: '14px',
			textAlign: 'left',
		},

		active: {
			backgroundColor: '#607d8b',
			color: '#fff',
		},

		normal: {
			backgroundColor: '#8bc34a',
			color: '#fff',
		},

		disabled: {
			backgroundColor: 'inherit',
			color: '#565656',
		},
	},
};

class Lessons extends Component {
	componentWillMount() {
		if (!this.props.isLoaded) {
			this.props.loadCourseInternal().then(() => {
				this.props.selectModule(parseInt(this.props.params.moduleId));
			}).catch((error) => {
				console.log(error);
			});
		}
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
renderLessons() {
	const lessons = this.props.activeModule.lessons;
	const { t } = this.props;
	return lessons.map((lesson, index) => {
		const lessonState = Progress.getLessonState(lesson);
		const isDisabled = lessonState.visualState === ProgressState.Disabled;

		return (
			<div
				key={lesson.id}
				className={`lesson-item ${lessonState.stateClass}`}
				style={styles.lessonWrapper}
				onClick={() => this.handleClick(lesson.id, lessonState, `/learn/${this.props.params.courseName}/${this.props.params.moduleId}/${this.props.params.moduleName}/${lesson.id}/${toSeoFrendly(lesson.name, 100)}/1`)}
			>
				<Paper
					key={lesson.id}
					zDepth={isDisabled ? 0 : 1}
					style={{
						...styles.lesson.base,
						...(isDisabled ? styles.lesson.disabled : {}),
					}}
				>
					<div className="number" style={styles.lessonNumber}>{`${index + 1}/${lessons.length}`}</div>
					<div className="name" style={styles.lessonName}>{lesson.name}</div>
					<div className="info" style={[ styles.lessonInfo.base, styles.lessonInfo[lessonState.stateClass] ]}>
						<span>{lesson.quizzes.length} {t('learn.questions-format')}</span>
					</div>
				</Paper>
			</div>
		);
	});
}

render() {
	const {
		course, modules, activeModule, isLoaded,
	} = this.props;

	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<Layout>
			{this.renderLessons()}
		</Layout>
	);
}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'lessons'),
		course: state.course,
		modules: state.modulesMapping,
		activeModule: !state.course ? null : state.modulesMapping[state.activeModuleId],
		lessons: state.lessonsMapping,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		loadCourseInternal,
		selectLesson,
		selectModule,
		selectQuiz,
	}, dispatch);
}

const translatedLessons = translate()(Radium(Lessons));

export default connect(mapStateToProps, mapDispatchToProps)(translatedLessons);
