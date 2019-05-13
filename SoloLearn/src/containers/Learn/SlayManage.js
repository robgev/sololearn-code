import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { toSeoFriendly } from 'utils';
import { getCourseAliasById } from 'reducers/courses.reducer';
import { changeProgress, toggleCourseInternal } from 'actions/learn';
import { PaperContainer, MenuItem, Title } from 'components/atoms';
import { Layout } from 'components/molecules';
import { ManageLessonCard } from './components';
import { resetProgress } from './SlayManage.api';

import './SlayManage.scss';
import Glossary from './components/Glossary';
import { getCourse } from './glossary.api';

class SlayManage extends Component {
	state={
		openGlossary: false,
		glossaryCourseId: null,
		glossaryContent: null,
		glossaryTitle: null,
	}

	openGlossary=(courseId, courseName) => {
		getCourse(courseId)
			.then(({ course }) => this.setState({ glossaryContent: course.glossary }));
		this.setState({ openGlossary: true, glossaryCourseId: courseId, glossaryTitle: courseName });
	}

	closeGlossary=() => {
		this.setState({ openGlossary: false, glossaryContent: null, glossaryTitle: null });
	}

	resetProgress = (courseId) => {
		this.props.changeProgress(courseId, 0);
		resetProgress(courseId);
	}

	toggleCourse=(courseId, isEnabled) => {
		this.props.toggleCourseInternal(courseId, isEnabled);
	}

	render() {
		const { skills: myCourses, courses, t } = this.props;
		const {
			openGlossary, glossaryCourseId, glossaryContent, glossaryTitle,
		} = this.state;
		const availableCourses = courses.filter(c => !myCourses.find(s => s.id === c.id && (s.iconUrl = c.iconUrl)));

		return (
			<Layout>
				<Title className="title">{t('course_picker.my-courses-section-title')}</Title>
				<PaperContainer>
					{
						myCourses.map(course => (
							<ManageLessonCard
								{...course}
								url={`/learn/course/${toSeoFriendly(getCourseAliasById(courses, course.id))}`}
								actions={
									[
										<MenuItem onClick={() => this.openGlossary(course.id, course.name)} >{t('course_picker.action.glossary')}</MenuItem>,
										<MenuItem onClick={() => { this.resetProgress(course.id); }} >{t('course_picker.action.reset-progress')}</MenuItem>,
										<MenuItem onClick={() => this.toggleCourse(course.id, false)} >{t('course_picker.action.remove')}</MenuItem>,
									]
								}
							/>
						))
					}
				</PaperContainer>
				<Title className="title">Available Courses</Title>
				<PaperContainer>
					{
						availableCourses.map(course => (
							<ManageLessonCard
								{...course}
								url={`/learn/course/${toSeoFriendly(getCourseAliasById(courses, course.id))}`}
								actions={
									[
										<MenuItem onClick={() => this.openGlossary(course.id, course.name)} >{t('course_picker.action.glossary')}</MenuItem>,
										<MenuItem onClick={() => this.toggleCourse(course.id, true)} >{t('course_picker.action.add-to-my-courses')}</MenuItem>,
									]
								}
							/>
						))
					}
				</PaperContainer>
				<Glossary
					open={openGlossary}
					courseId={glossaryCourseId}
					courseName={glossaryTitle}
					onClose={this.closeGlossary}
					content={glossaryContent}
				/>
			</Layout>
		);
	}
}
const mapStateToProps = state => ({
	skills: state.userProfile.skills,
	courses: state.courses,
});
const mapDispatchToProps = {
	changeProgress,
	toggleCourseInternal,
};
export default connect(mapStateToProps, mapDispatchToProps)(translate()(SlayManage));
