import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { toSeoFriendly } from 'utils';
import { getCourseAliasById } from 'reducers/courses.reducer';
import { changeProgress, toggleCourseInternal } from 'actions/learn';
import { PopupActions, MenuItem, Title, Popup, PopupContent, Container } from 'components/atoms';
import { FlatButton } from 'components/molecules';
import ConfirmationPopup from 'components/ConfirmationPopup';
import { ManageLessonCard, OverlayLoading } from './components';
import { resetProgress } from './SlayManage.api';

import './SlayManage.scss';
// import Glossary from './components/Glossary';
import { getCourse } from './glossary.api';

class SlayManage extends Component {
	state={
		// openGlossary: false,
		// glossaryCourseId: null,
		// glossaryContent: null,
		// glossaryTitle: null,

		openResetConfirmation: false,
		resetting: false,
		courseToReset: null,
	}

	// openGlossary=(courseId, courseName) => {
	// 	getCourse(courseId)
	// 		.then(({ course }) => this.setState({ glossaryContent: course.glossary }));
	// 	this.setState({ openGlossary: true, glossaryCourseId: courseId, glossaryTitle: courseName });
	// }

	// closeGlossary=() => {
	// 	this.setState({ openGlossary: false, glossaryContent: null, glossaryTitle: null });
	// }

	toggleResetConfirmation = (courseId) => {
		this.setState({ courseToReset: courseId });
		this.setState(s => ({ openResetConfirmation: !s.openResetConfirmation }));
	}

	resetProgress =async () => {
		const { courseToReset } = this.state;
		this.toggleResetConfirmation();
		this.setState({ resetting: true });
		await resetProgress(courseToReset);
		this.setState({ resetting: false });
		this.props.changeProgress(courseToReset, 0);
	}

	toggleCourse=(courseId, isEnabled) => {
		this.props.toggleCourse(courseId, isEnabled);
	}

	render() {
		const {
			 myCourses, courses, t, open, onClose, toggling,
		} = this.props;
		const { openResetConfirmation, resetting } = this.state;
		// const {
		// 	openGlossary, glossaryCourseId, glossaryContent, glossaryTitle,
		// } = this.state;
		const availableCourses = courses.filter(c => !myCourses.find(s => s.id === c.id && (s.iconUrl = c.iconUrl)));

		return (
			<React.Fragment>
				<Popup
					open={open}
					onClose={onClose}
					classes={{
						paper: 'slayManagePopup',

					}}
				>
					<PopupContent>
						{
							(toggling || resetting) &&
							<OverlayLoading />
						}
						{myCourses && myCourses.length > 0 && <Title className="title">{t('course_picker.my-courses-section-title')}</Title>}
						<Container>
							{
								myCourses.map(course => (
									<ManageLessonCard
										{...course}
										url={`/learn/course/${toSeoFriendly(getCourseAliasById(courses, course.id))}`}
										actions={
											[
												// <MenuItem onClick={() => this.openGlossary(course.id, course.name)} >{t('course_picker.action.glossary')}</MenuItem>,
												<MenuItem onClick={() => this.toggleResetConfirmation(course.id)} >{t('course_picker.action.reset-progress')}</MenuItem>,
												<MenuItem onClick={() => this.toggleCourse(course.id, false)} >{t('course_picker.action.remove')}</MenuItem>,
											]
										}
									/>
								))
							}
						</Container>
						{availableCourses && availableCourses.length > 0 && <Title className="title">{t('course_picker.available-courses-section-title')}</Title>}
						<Container>
							{
								availableCourses.map(course => (
									<ManageLessonCard
										{...course}
										url={`/learn/course/${toSeoFriendly(getCourseAliasById(courses, course.id))}`}
										addCourse={() => this.toggleCourse(course.id, true)}
										actions={
											[
												// <MenuItem onClick={() => this.openGlossary(course.id, course.name)} >{t('course_picker.action.glossary')}</MenuItem>,
												<MenuItem onClick={() => this.toggleCourse(course.id, true)} >{t('course_picker.action.add-to-my-courses')}</MenuItem>,
											]
										}
									/>
								))
							}
						</Container>
						{/* <Glossary
					open={openGlossary}
					courseId={glossaryCourseId}
					courseName={glossaryTitle}
					onClose={this.closeGlossary}
					content={glossaryContent}
				/> */}
					</PopupContent>
					<PopupActions>
						<FlatButton onClick={onClose}>{t('common.close-title')}</FlatButton>
					</PopupActions>
				</Popup>
				<ConfirmationPopup
					open={openResetConfirmation}
					onCancel={this.toggleResetConfirmation}
					onConfirm={this.resetProgress}
					title={t('learn.reset-course-popup-title')}
					confirmButtonLabel={t('learn.reset-course-popup-title')}
				>
					{t('learn.reset-course-popup-message')}
				</ConfirmationPopup>
			</React.Fragment>
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
