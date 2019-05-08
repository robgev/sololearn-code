import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { PaperContainer, MenuItem, Title } from 'components/atoms';
import { Layout } from 'components/molecules';
import { ManageLessonCard } from './components';

import './SlayManage.scss';

class SlayManage extends Component {
	render() {
		const { skills: myCourses, courses, t } = this.props;
		const availableCourses = courses.filter(c => !myCourses.find(s => s.id === c.id && (s.iconUrl = c.iconUrl)));
		return (
			<Layout>
				<Title className="title">{t('course_picker.my-courses-section-title')}</Title>
				<PaperContainer>
					{
						myCourses.map(course => (
							<ManageLessonCard
								{...course}
								actions={
									[
										<MenuItem onClick={() => { console.log('Glossary'); }} >{t('course_picker.action.glossary')}</MenuItem>,
										<MenuItem onClick={() => { console.log('Reset Progress'); }} >{t('course_picker.action.reset-progress')}</MenuItem>,
										<MenuItem onClick={() => { console.log('Remove'); }} >{t('course_picker.action.remove')}</MenuItem>,
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
								actions={
									[
										<MenuItem onClick={() => { console.log('Glossary'); }} >{t('course_picker.action.glossary')}</MenuItem>,
										<MenuItem onClick={() => { console.log('Add to My Courses'); }} >{t('course_picker.action.add-to-my-courses')}</MenuItem>,
									]
								}
							/>
						))
					}
				</PaperContainer>
			</Layout>
		);
	}
}
const mapStateToProps = state => ({
	skills: state.userProfile.skills,
	courses: state.courses,
});
export default connect(mapStateToProps)(translate()(SlayManage));
