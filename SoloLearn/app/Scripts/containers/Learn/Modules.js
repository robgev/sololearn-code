// General modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Link, browserHistory } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import { loadCourseInternal, toggleCourseInternal, toggleCourse, selectModule } from 'actions/learn';
import { isLoaded } from 'reducers';

// Service
import Service, { AppDefaults } from 'api/service';
import Progress, { ProgressState } from 'api/progress';

// Components
import CourseChip from 'components/Shared/CourseChip';
import BusyWrapper from 'components/Shared/BusyWrapper';
import Layout from 'components/Layouts/GeneralLayout';

// Popups
import Popup from 'api/popupService';

// Utils
import { toSeoFrendly, EnumNameMapper, numberFormatter } from 'utils';
import texts from 'defaults/texts';

// i18n
import { translate } from 'react-i18next';

const styles = {
	noCourses: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: '300px',
		height: '95px',
		padding: '10px',
		margin: '-57.5px 0 0 -160px',
		textAlign: 'center',
	},

	noCoursesTitle: {
		margin: '0 0 5px 0',
		fontSize: '14px',
		color: '#696868',
	},

	noCoursesSubTitle: {
		margin: '0 0 10px 0',
		fontSize: '19px',
		color: '#696868',
	},

	addCoursesButton: {
		width: '250px',
	},

	courseBar: {
		overflow: 'hidden',
		padding: '10px 10px 15px 10px',
		boxShadow: '0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23)',
		cursor: 'pointer',
	},

	courses: {
		padding: 0,
	},

	coursesTitle: {
		padding: '10px',
		fontWeight: '500',
		fontSize: '18px',
		borderBottom: 'none',
	},

	coursesSubTitle: {
		padding: '0 0 10px 20px',
		fontSize: '13px',
	},

	course: {
		padding: '15px 15px 8px 15px',
		overflow: 'hidden',
	},

	availableCourses: {
		padding: '10px 0 0 0',
	},

	courseDetails: {
		overflow: 'hidden',
		width: '90%',
		float: 'left',
		cursor: 'pointer',
	},

	courseIcon: {
		width: '40px',
		margin: '0 10px 0 0',
		display: 'inline-block',
		verticalAlign: 'middle',
	},

	courseInfo: {
		display: 'inline-block',
		verticalAlign: 'middle',
		width: 'inherit',
	},

	courseName: {
		color: '#000',
		margin: '0 0 5px 0',
	},

	courseProgress: {
		backgroundColor: '#dedede',
	},

	courseActions: {
		display: 'inline-block',
		verticalAlign: 'middle',
		float: 'right',
	},

	module: {
		base: {
			padding: '20px 0',
			textAlign: 'center',
			width: '100%',
			overflow: 'hidden',
		},

		none: {
			float: 'left',
			width: '50%',
		},
	},

	moduleContent: {
		base: {
			maxWidth: '50%',
			display: 'inline-block',
			textDecoration: 'none',
		},

		none: {
			maxWidth: '100%',
		},

		right: {
			float: 'right',
		},

		left: {
			float: 'left',
		},

		center: {
			margin: 'auto',
		},
	},

	moduleCircle: {
		base: {
			height: '100px',
			width: '100px',
			background: '#8bc34a',
			margin: 'auto',
			transition: 'box-shadow ease-in 100ms',
		},

		active: {
			background: '#607d8b',
		},

		disabled: {
			background: '#ddd',
		},

	},

	moduleImage: {
		margin: '5px',
		height: '90px',
		width: '90px',
		pointerEvents: 'none',
	},

	moduleName: {
		display: 'block',
		fontWeight: 300,
		color: '#777',
		margin: '10px 0 0 0',
	},

	shortcutContent: {
		textAlign: 'center',
	},

	shortcutButton: {
		backgroundColor: '#ffcb1f',
		display: 'inline-block',
	},
};

const ModuleAlignment = {
	None: 0,
	Center: 1,
	Left: 2,
	Right: 2,
};
EnumNameMapper.apply(ModuleAlignment);

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'modules'),
	course: state.course,
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
@Radium
class Modules extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			resetPopupOpened: false,
		};

		// Keeping for progress resetting
		this.editableCourseId = null;

		this.handleResetPopupClose = this.handleResetPopupClose.bind(this);
		this.resetProgress = this.resetProgress.bind(this);
	}

	async componentWillMount() {
		const {
			course,
			courses,
			isLoaded,
			userProfile,
			selectModule,
			loadCourseInternal,
			params: { courseName },
		} = this.props;
		this.setState({ loading: true });
		if (!isLoaded || courseName !== course.alias) {
			const courseNameIsANumber = courseName.match(/\d+/);
			// I've added this temporary code to reroute to the slay lessons
			// The next if statement needs to be removed after reconstructing the routes
			if (courseNameIsANumber) {
				browserHistory.replace(`/learn/slayLesson/2/${courseName}/1`);
			} else {
				const currentCourse = courses.find(item =>
					item.alias.toLowerCase() === courseName.toLowerCase());
				const courseId = currentCourse ? currentCourse.id : null;
				await loadCourseInternal(courseId);
			}
			document.title = this.props.course ? `Modules of ${this.props.course.name}` : 'Sololearn | Slay';
			ReactGA.ga('send', 'screenView', { screenName: 'Modules Page' });
		}
		selectModule(null);
		this.setState({ loading: false });
	}

	renderModules() {
		const { modules } = this.props.course;

		return modules.map((module) => {
			const moduleState = Progress.getModuleState(module);
			const alignmentClass = ModuleAlignment.getName(module.alignment);
			const { stateClass } = moduleState;
			const iconSource =
				`${AppDefaults.downloadHost}Modules/${this.props.course.id}/${module.id}${moduleState.visualState === ProgressState.Disabled ? '_disabled' : ''}.png`;

			return (
				[
					<div className="shortcut-content" style={styles.shortcutContent}>
						{ (module.allowShortcut && moduleState.visualState === ProgressState.Disabled) &&
						<Link to={`/learn/${this.props.params.courseName}/${module.id}/shortcut/1`}>
							<RaisedButton
								className="shortcut-button"
								label={texts.shortcutButton}
								overlayStyle={styles.shortcutButton}
							/>
						</Link>
						}
					</div>,
					<div
						className={`module ${alignmentClass}`}
						style={
							module.alignment === 1 ?
								styles.module.base :
								[ styles.module.base, styles.module[alignmentClass] ]
						}
						key={module.id}
					>
						<Link
							style={{ ...styles.moduleContent.base, ...styles.moduleContent[alignmentClass] }}
							className="content"
							to={`/learn/${this.props.params.courseName}/${module.id}/${toSeoFrendly(module.name, 100)}`}
							onClick={e => this.handleClick(e, module.id, moduleState)}
						>
							<Paper className={`module-circle ${stateClass}`} style={{ ...styles.moduleCircle.base, ...styles.moduleCircle[stateClass] }} zDepth={1} circle key={module.id}>
								<img style={styles.moduleImage} alt={module.name} src={iconSource} />
							</Paper>
							<span className="module-name" style={styles.moduleName}>{module.name}</span>
						</Link>
					</div>,
				]

			);
		});
	}

	handleClick(e, moduleId, moduleState) {
		if (moduleState.visualState === ProgressState.Disabled) {
			e.preventDefault();
			return;
		}
		this.props.selectModule(moduleId);
	}

	toggleCourse(courseId, enable) {
		this.props.toggleCourseInternal(courseId, enable);
	}

	async selectCourse(courseId, addToCourses) {
		const { alias } = this.props.courses.find(item => item.id === courseId);
		browserHistory.push(`/learn/${alias}`);
		this.closeCourseSelect();
		this.setState({ loading: true });
		if (addToCourses) {
		 await this.props.toggleCourseInternal(courseId, true);
		}
		await this.props.loadCourseInternal(courseId);
		this.setState({ loading: false });
	}

	resetProgress(courseId) {
		this.handleResetPopupClose();

		const { skills } = this.props.userProfile;
		const index = skills.findIndex(item => item.id === courseId);
		skills[index].progress = 0;

		this.props.toggleCourse(skills);
		Progress.reset();
		Service.request('ResetProgress', { courseId });
	}

	handleResetPopupOpen(courseId) {
		this.editableCourseId = courseId;
		this.setState({ resetPopupOpened: true });
	}

	handleResetPopupClose() {
		this.setState({ resetPopupOpened: false });
	}

	showCertificate = () => {
		const { modules, id } = this.props.course;
		const lastModule = modules[modules.length - 1];
		const { progress } = Progress.getModuleState(lastModule);
		const isCourseFinished = progress === 100;
		return (
			<div style={{
				...styles.module.base,
				display: 'flex',
				justifyContent: 'center',
			}}
			>
				<CourseChip
					noBoxShadow
					name="Certificate"
					color="transparent"
					wrapperStyle={{ padding: 0 }}
					disabled={!isCourseFinished}
					customLink={`/certificate/${id}`}
					iconUrl={`https://api.sololearn.com/uploads/Modules/certificate${isCourseFinished ? '' : '_disabled'}.png`}
				/>
			</div>
		);
	}

	render() {
		const that = this;
		const {
			course,
			isLoaded: isModuleLoaded,
			t,
		} = this.props;
		const { loading } = this.state;
		if (!isModuleLoaded && this.props.userProfile.skills.length > 0) {
			return <CircularProgress size={80} thickness={5} />;
		}

		const userCourses = this.props.userProfile.skills;
		const activeCourse = userCourses.find(item => item.id === course.id);
		const activeCourseProgress = activeCourse ? activeCourse.progress : 0;

		const resetProgressActions = [
			{
				componentType: FlatButton,
				label: 'popupCancel',
				primary: false,
				actionCallback: that.handleResetPopupClose,
			},
			{
				componentType: FlatButton,
				label: 'resetContinue',
				primary: true,
				actionCallback: () => { that.resetProgress(this.editableCourseId); },
			},
		];

		return (
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
				loadingComponent={
					<CircularProgress
						size={100}
					/>
				}
			>
				<Layout>
					{ userCourses.length > 0 ?

						[
							<div
								className="course-selector"
								style={styles.courseBar}
								key="course-selector"
							>
								<div className="details" style={styles.courseDetails}>
									<img src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`} alt={course.name} style={styles.courseIcon} />
									<IconMenu
										style={styles.courseActions}
										iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
										anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
										targetOrigin={{ horizontal: 'right', vertical: 'top' }}
									>
										<MenuItem
											primaryText={t('course_picker.action.remove')}
											onClick={() => this.toggleCourse(course.id, false)}
										/>
										<MenuItem
											primaryText={t('course_picker.action.reset-progress')}
											onClick={() => this.handleResetPopupOpen(course.id)}
										/>
										<MenuItem
											primaryText={t('common.share-title')}
										/>
									</IconMenu>
									<div style={styles.courseInfo}>
										<p style={styles.courseName}>{course.name}</p>
										<LinearProgress
											style={styles.courseProgress}
											mode="determinate"
											value={activeCourseProgress * 100}
											color="#8BC34A"
										/>
									</div>
								</div>
							</div>,
							<div className="modules" key="modules">
								{this.renderModules()}
								{this.showCertificate()}
							</div>,
						]
						:
						<div className="no-courses" style={styles.noCourses}>
							<p style={styles.noCoursesTitle}>{t('learn.add-courses-title')}</p>
							<p style={styles.noCoursesSubTitle}>{t('learn.add-courses-message')}</p>
							<RaisedButton
								style={styles.addCoursesButton}
								label={t('learn.add-courses-button-title')}
								secondary
								onClick={() => this.openCourseSelect()}
							/>
						</div>
					}

					{ this.state.resetPopupOpened && Popup.getPopup(Popup.generatePopupActions(resetProgressActions), this.state.resetPopupOpened, this.handleResetPopupClose, [ { key: 'hintSkipConfirmText', replacemant: this.skipPrice } ]) }
				</Layout>
			</BusyWrapper>
		);
	}
}

export default translate()(Modules);
