// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium, { Style } from 'radium';
import { browserHistory } from 'react-router';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadCourseInternal, toggleCourseInternal, toggleCourse, selectModule } from '../../actions/learn';
import { isLoaded } from '../../reducers';

// Service
import Service from '../../api/service';
import { AppDefaults } from '../../api/service';
import Progress, { ProgressState } from '../../api/progress';

// Popups
import Popup from '../../api/popupService';

// Material UI components
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Utils
import toSeoFrendly from '../../utils/linkPrettify';
import EnumNameMapper from '../../utils/enumNameMapper';
import getSyles from '../../utils/styleConverter';
import numberFormatter from '../../utils/numberFormatter';
import texts from '../../defaults/texts';

const styles = {
	parent: {
		position: 'relative',
		width: '1000px',
		margin: '0 auto',
		height: '100%',
	},

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

class Modules extends Component {
	constructor(props) {
		super(props);

		this.state = {
			lockedPopupOpened: false,
			resetPopupOpened: false,
			selectCourse: false,
		};

		// Keeping for progress resetting
		this.editableCourseId = null;

		this.handleClick = this.handleClick.bind(this);
		this.closeCourseSelect = this.closeCourseSelect.bind(this);
		this.handleResetPopupClose = this.handleResetPopupClose.bind(this);
		this.resetProgress = this.resetProgress.bind(this);
	}

	renderModules() {
		const that = this;
		const modules = this.props.course.modules;

		return modules.map((module, index) => {
			const moduleState = Progress.getModuleState(module);
			const alignmentClass = ModuleAlignment.getName(module.alignment);
			const stateClass = moduleState.stateClass;
			const iconSource = `${AppDefaults.downloadHost}Modules/${this.props.course.id}/${module.id}${moduleState.visualState == ProgressState.Disabled ? '_disabled' : ''}.png`;

			return (
				[ <div className="shortcut-content" style={styles.shortcutContent}>
					{ (module.allowShortcut && moduleState.visualState == ProgressState.Disabled) &&
					<Link to={`/learn/${this.props.params.courseName}/${module.id}/shortcut/1`}>
						<RaisedButton className="shortcut-button" label={texts.shortcutButton} overlayStyle={getSyles(styles.shortcutButton)} />
					</Link>
					}
				</div>,
				<div className={`module ${alignmentClass}`} style={module.alignment == 1 ? styles.module.base : [ styles.module.base, styles.module[alignmentClass] ]} key={module.id}>
						<Link style={getSyles(styles.moduleContent.base, styles.moduleContent[alignmentClass])} className="content" to={`/learn/${this.props.params.courseName}/${module.id}/${toSeoFrendly(module.name, 100)}`} onClick={e => this.handleClick(e, module.id, moduleState)}>
						<Paper className={`module-circle ${stateClass}`} style={getSyles(styles.moduleCircle.base, styles.moduleCircle[stateClass])} zDepth={1} circle key={module.id}>
								<img style={styles.moduleImage} alt={module.name} src={iconSource} />
							</Paper>
						<span className="module-name" style={styles.moduleName}>{module.name}</span>
					</Link>
     </div> ]

			);
		});
	}

	handleClick(e, moduleId, moduleState) {
		if (moduleState.visualState == ProgressState.Disabled) {
			e.preventDefault();
			return;
		}
		this.props.selectModule(moduleId);
	}

	renderCourses() {
		const courses = this.props.courses;
		const userCourses = this.props.userProfile.skills;

		const courseIds = courses.map(item => item.id);
		const userCoursesIds = userCourses.map(item => item.id);

		const difference = userCoursesIds.map((id, index) => {
			if (courseIds.indexOf(id) < 0) {
				return userCourses[index];
			}
		}).concat(courseIds.map((id, index) => {
			if (userCoursesIds.indexOf(id) < 0) {
				return courses[index];
			}
		})).filter(item => item != undefined);

		return (
			<div>
				{ userCourses.length > 0 &&
                    [ <div className="user-courses" key="user-courses">
                    	<p style={styles.coursesSubTitle}>My Courses</p>
                    	{
                    		userCourses.map((course, index) => (
                    			[ <div key={course.id} style={styles.course}>
                    				<div className="details" style={styles.courseDetails} onClick={() => this.selectCourse(course.id, false)}>
		<img src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`} alt={course.name} style={styles.courseIcon} />
                    					<div style={styles.courseInfo}>
		<p style={styles.courseName}>{course.name}</p>
		<LinearProgress style={styles.courseProgress} mode="determinate" value={course.progress * 100} color="#8BC34A" />
	</div>
 </div>
                    				<IconMenu
		style={styles.courseActions}
		iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
	>
		<MenuItem primaryText="Remove" onClick={() => this.toggleCourse(course.id, false)} />
		<MenuItem primaryText="Reset Progress" onClick={() => this.handleResetPopupOpen(course.id)} />
                    					<MenuItem primaryText="Share" />
 </IconMenu>
                         </div>,
                    			<Divider key="user-course-item-divider" /> ]
                    		))
                    	}
                      </div>,
	<Divider key="user-courses-divider" /> ]
				}
				{ difference.length > 0 &&
				<div className="available-courses" style={styles.availableCourses}>
					<p style={styles.coursesSubTitle}>Available Courses</p>
					{
                    		difference.map((course, index) => (
                    			[ <div key={course.id} style={styles.course} key="available-courses">
	<div className="details" style={styles.courseDetails} onClick={() => this.selectCourse(course.id, true)}>
									<img src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`} alt={course.name} style={styles.courseIcon} />
									<div style={styles.courseInfo}>
			<p style={styles.courseName}>{course.name}</p>
			<p>{numberFormatter(course.learners, true)}</p>
  </div>
								</div>
								<IconMenu
		style={styles.courseActions}
		iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
		targetOrigin={{ horizontal: 'right', vertical: 'top' }}
	>
		<MenuItem primaryText="Add to My Courses" onClick={() => this.toggleCourse(course.id, true)} />
		<MenuItem primaryText="Share" />
	</IconMenu>
</div>,
	<Divider key="available-course-item-divider" /> ]
                    		))
                    	}
				</div>
				}
			</div>
		);
	}

	toggleCourse(courseId, enable) {
		this.props.toggleCourseInternal(courseId, enable);
	}

	selectCourse(courseId, addToCourses) {
		const alias = this.props.courses.find(item => item.id == courseId).alias;
		browserHistory.push(`/learn/${alias}`);

		this.closeCourseSelect();
		if (addToCourses) this.props.toggleCourseInternal(courseId, true);
		this.props.loadCourseInternal(courseId);
	}

	openCourseSelect() {
		this.setState({ selectCourse: true });
	}

	closeCourseSelect() {
		this.setState({ selectCourse: false });
	}

	resetProgress(courseId) {
		this.handleResetPopupClose();

		const skills = this.props.userProfile.skills;
		const index = skills.findIndex(item => item.id == courseId);
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

	render() {
		const that = this;
		const { course, isLoaded } = this.props;
		if (!isLoaded && this.props.userProfile.skills.length > 0) {
			return <CircularProgress size={80} thickness={5} />;
		}

		const userCourses = this.props.userProfile.skills;
		const activeCourse = userCourses.find(item => item.id == course.id);
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
			<div style={styles.parent} key="course-selector-rappper">
				{ userCourses.length > 0 ?

					[ <div className="course-selector" style={styles.courseBar} onClick={() => this.openCourseSelect()} key="course-selector">
						<div className="details" style={styles.courseDetails}>
							<img src={`https://www.sololearn.com/Icons/Courses/${course.id}.png`} alt={course.name} style={styles.courseIcon} />
							<div style={styles.courseInfo}>
								<p style={styles.courseName}>{course.name}</p>
								<LinearProgress style={styles.courseProgress} mode="determinate" value={activeCourseProgress * 100} color="#8BC34A" />
							</div>
						</div>
						<FlatButton label="CHANGE" style={styles.courseActions} />
       </div>,
						<div className="modules" key="modules">
						{this.renderModules()}
					</div> ]
					:
					<div className="no-courses" style={styles.noCourses}>
						<p style={styles.noCoursesTitle}>No Courses</p>
						<p style={styles.noCoursesSubTitle}>Start Learning Now!</p>
						<RaisedButton style={styles.addCoursesButton} label="Add Courses" secondary onClick={() => this.openCourseSelect()} />
					</div>
				}
				{
					this.state.selectCourse &&
					<Dialog
						id="courses"
						modal={false}
						open={this.state.selectCourse}
						title="Select Course"
						titleStyle={styles.coursesTitle}
						bodyStyle={styles.courses}
						autoScrollBodyContent
						onRequestClose={this.closeCourseSelect}
					>{this.renderCourses()}
					</Dialog>
				}

				{ this.state.resetPopupOpened && Popup.getPopup(Popup.generatePopupActions(resetProgressActions), this.state.resetPopupOpened, this.handleResetPopupClose, [ { key: 'hintSkipConfirmText', replacemant: this.skipPrice } ]) }
			</div>
		);
	}

	componentWillMount() {
		if (!this.props.isLoaded) {
			if (this.props.userProfile.skills.length > 0) {
				const courseName = this.props.params.courseName;
				const course = courseName ? this.props.courses.find(item => item.alias.toLowerCase() == courseName.toLowerCase()) : null;
				const courseId = course ? course.id : null;
				this.props.loadCourseInternal(courseId);
			}
		}
		this.props.selectModule(null);
	}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'modules'),
		course: state.course,
		courses: state.courses,
		userProfile: state.userProfile,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		loadCourseInternal,
		toggleCourse,
		toggleCourseInternal,
		selectModule,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Modules));
