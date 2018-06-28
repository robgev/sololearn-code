// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Utils and defaults
import PopupTypes from '../../../defaults/feedPopupTypes';

const styles = {
	course: {
		display: 'flex',
		alignItems: 'center',
		margin: '0 0 10px 0',
		position: 'relative',
		zIndex: 2,
		textDecoration: 'none',
	},

	courseIcon: {
		width: '60px',
		height: '60px',
	},

	courseName: {
		fontSize: '16px',
		fontWeight: 500,
		margin: '0 0 0 7px',
		color: '#565353',
	},
};

class Course extends Component {
	constructor(props) {
		super(props);
	}

	openCoursePopup(e) {
		const course = this.props.course;

		e.stopPropagation();
		e.preventDefault();

		const data = {
			type: PopupTypes.course,
			courseId: course.id,
		};

		this.props.openPopup(data);
	}

	render() {
		const course = this.props.course;

		return (
			<Link to={`/learn/${course.alias}`} className="course" style={styles.course} onClick={e => this.openCoursePopup(e)}>
				<img src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`} style={styles.courseIcon} />
				<p style={styles.courseName}>{course.name}</p>
			</Link>
		);
	}
}

export default Course;
