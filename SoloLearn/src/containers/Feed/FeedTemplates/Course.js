// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import { toSeoFriendly } from 'utils';
import PopupTypes from 'defaults/feedPopupTypes';

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
	openCoursePopup = () => {
		const { course } = this.props;
		const data = {
			type: PopupTypes.course,
			courseId: course.id,
			courseName: course.name,
		};
		this.props.openPopup(data);
	}

	render() {
		const { course } = this.props;

		return (
			<div
				tabIndex={0}
				role="button"
				className="course"
				style={styles.course}
				onClick={this.openCoursePopup}
			>
				<img
					alt="course icon"
					src={`https://api.sololearn.com/uploads/Courses/${course.id}.png`}
					style={styles.courseIcon}
				/>
				<p style={styles.courseName}>{course.name}</p>
			</div>
		);
	}
}

export default Course;
