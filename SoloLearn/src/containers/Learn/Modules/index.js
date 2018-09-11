import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { loadCourseInternal, toggleCourseInternal, toggleCourse, selectModule } from 'actions/learn';
import { getCourseByCourseName } from 'reducers/courses.reducer';
import { isCourseLoaded } from 'reducers/reducer_course';

import Service from 'api/service';
import Progress, { ProgressState } from 'api/progress';

import BusyWrapper from 'components/BusyWrapper';
import Layout from 'components/Layouts/GeneralLayout';

import Dialog from 'components/StyledDialog';

import 'styles/Learn/Modules.scss';

import UserProgressToolbar from '../UserProgressToolbar';
import ModuleChips from './ModuleChips';
import ModuleChip from './ModuleChip';
import Certificate from './Certificate';

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
			courses,
			isLoaded,
			selectModule,
			loadCourseInternal,
			params,
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
		if (!isModuleLoaded && this.props.userProfile.skills.length > 0) {
			return <CircularProgress size={40} style={{ display: 'flex', alignItems: 'center', margin: 'auto' }} />;
		}

		const { modules, id } = course;
		const userCourses = this.props.userProfile.skills;

		return (
			<Layout
				sidebarContent={<UserProgressToolbar />}
			>
				<BusyWrapper
					paper
					isBusy={loading}
					style={{
						padding: 15,
						minHeight: '60vh',
						alignItems: 'initial',
					}}
					wrapperClassName="modules-container"
					loadingComponent={
						<CircularProgress
							size={100}
						/>
					}
				>
					{userCourses.length > 0 ?

						<div className="modules-wrapper">
							<div className="course-selector">
								<div className="details">
									<p className="course-name">{course.name}</p>
									<IconMenu
										className="course-actions"
										iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
										anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
										targetOrigin={{ horizontal: 'right', vertical: 'top' }}
									>
										<MenuItem
											primaryText={t('course_picker.action.reset-progress')}
											onClick={() => this.handleResetPopupOpen(course.id)}
										/>
									</IconMenu>
								</div>
							</div>
							<div className="modules">
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
								<ModuleChip
									onClick={() => { }}
									className="center"
									name="More on the Topic"
									paperClassName="normal"
									linkAddress={`/learn/more-on/${id}`}
									iconSource="https://api.sololearn.com/uploads/Courses/assets/more.png"
								/>
							</div>
						</div>
						:
						<div className="no-courses">
							<p className="title">{t('learn.add-courses-title')}</p>
							<p className="sub-title">{t('learn.add-courses-message')}</p>
							<RaisedButton
								secondary
								className="add-button"
								onClick={this.openCourseSelect}
								label={t('learn.add-courses-button-title')}
							/>
						</div>
					}
					<Dialog
						open={resetPopupOpened}
						actions={[
							<FlatButton
								label={t('common.cancel-title')}
								onClick={this.handleResetPopupClose}
							/>,
							<FlatButton
								label={t('learn.reset-course-popup-title')}
								onClick={this.resetProgress}
							/>,
						]}
					>
						{t('learn.reset-course-popup-message')}
					</Dialog>

				</BusyWrapper>
			</Layout>
		);
	}
}

export default Modules;
