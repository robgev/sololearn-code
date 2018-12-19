import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { MoreVert } from 'components/icons';
import {
	Heading,
	MenuItem,
	PaperContainer,
	Popup,
	PopupTitle,
	PopupContent,
	PopupActions,
	PopupContentText,
	FlexBox,
} from 'components/atoms';
import {
	IconMenu,
	FlatButton,
	LayoutWithSidebar,
	EmptyCard,
} from 'components/molecules';

import { loadCourseInternal, toggleCourseInternal, toggleCourse, selectModule } from 'actions/learn';
import { getCourseByCourseName } from 'reducers/courses.reducer';
import { isCourseLoaded } from 'reducers/reducer_course';

import Service, { AppDefaults } from 'api/service';
import Progress, { ProgressState } from 'api/progress';

import './styles.scss';

import { UserProgressToolbar } from '../components';
import ModuleChips from './ModuleChips';
import ModuleChip from './ModuleChips/ModuleChip';
import Certificate from './Certificate';
import AddCourse from './AddCourse';

const mapStateToProps = (state, ownProps) => ({
	isLoaded: isCourseLoaded(state, ownProps.params.courseName),
	course: getCourseByCourseName(state, ownProps.params.courseName),
	courses: state.courses,
	userProfile: state.userProfile,
});

const mapDispatchToProps = {
	loadCourseInternal,
	toggleCourse,
	toggleCourseInternal,
	selectModule,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Modules extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			resetPopupOpened: false,
		};

		// Keeping for progress resetting
		this.editableCourseId = null;
	}

	async componentWillMount() {
		const {
			course,
			isLoaded,
			selectModule,
			loadCourseInternal,
		} = this.props;
		this.setState({ loading: true });
		if (!isLoaded) {
			// I've added this temporary code to reroute to the slay lessons
			// The next if statement needs to be removed after reconstructing the routes
			await loadCourseInternal(course.id);
			document.title = this.props.course ? `Modules of ${this.props.course.name}` : 'Sololearn | Slay';
			ReactGA.ga('send', 'screenView', { screenName: 'Modules Page' });
		}
		selectModule(null);
		this.setState({ loading: false });
	}

	handleClick = (e, moduleId, moduleState) => {
		if (moduleState.visualState === ProgressState.Disabled) {
			e.preventDefault();
			return;
		}
		this.props.selectModule(moduleId);
	}

	toggleCourse = (courseId, enable) => {
		this.props.toggleCourseInternal(courseId, enable);
	}

	resetProgress = () => {
		const courseId = this.editableCourseId;
		this.handleResetPopupClose();

		const { skills } = this.props.userProfile;
		const index = skills.findIndex(item => item.id === courseId);
		skills[index].progress = 0;

		this.props.toggleCourse(skills);
		Progress.reset();
		Service.request('ResetProgress', { courseId });
	}

	handleResetPopupOpen = (courseId) => {
		this.editableCourseId = courseId;
		this.setState({ resetPopupOpened: true });
	}

	handleResetPopupClose = () => {
		this.setState({ resetPopupOpened: false });
	}

	render() {
		const {
			t,
			course,
			params: { itemType, courseName },
			isLoaded: isModuleLoaded,
		} = this.props;
		const { loading, resetPopupOpened } = this.state;
		const { modules, id } = course;
		const userCourses = this.props.userProfile.skills;

		return (
			<LayoutWithSidebar sidebar={<UserProgressToolbar />}>
				{loading || (!isModuleLoaded && this.props.userProfile.skills.length > 0)
					? <EmptyCard paper loading />
					: userCourses.length > 0
						? (
							<PaperContainer>
								<FlexBox justifyBetween>
									<Heading>{course.name}</Heading>
									<IconMenu
										icon={MoreVert}
										anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
										transformOrigin={{ horizontal: 'right', vertical: 'top' }}
									>
										<MenuItem onClick={() => this.handleResetPopupOpen(course.id)}>
											{t('course_picker.action.reset-progress')}
										</MenuItem>
									</IconMenu>
								</FlexBox>
								<ModuleChips
									courseId={id}
									modules={modules}
									itemType={itemType}
									onClick={this.handleClick}
									courseName={courseName}
								/>
								<Certificate
									courseId={id}
									modules={modules}
								/>
								{
									course.hasAdditionalLessons &&
									<ModuleChip
										state="normal"
										className="center"
										completionPercent={100}
										to={`/learn/more-on/${id}`}
										name={t('learn.more-on-topic')}
										iconSource={`${AppDefaults.downloadHost}/Courses/assets/more.png`}
									/>
								}
							</PaperContainer>
						)
						: <AddCourse />
				}
				<Popup
					open={resetPopupOpened}
					onClose={this.handleResetPopupClose}
				>
					<PopupTitle>{t('learn.reset-course-popup-title')}</PopupTitle>
					<PopupContent>
						<PopupContentText>{t('learn.reset-course-popup-message')}</PopupContentText>
					</PopupContent>
					<PopupActions>
						<FlatButton onClick={this.handleResetPopupClose}>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton onClick={this.resetProgress}>
							{t('learn.reset-course-popup-title')}
						</FlatButton>
					</PopupActions>
				</Popup>
			</LayoutWithSidebar>
		);
	}
}

export default Modules;
