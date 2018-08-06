import React from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import { numberFormatter, toSeoFriendly } from 'utils';
import 'styles/Feed/CoursePopup.scss';

const CoursePopup = ({
	courseId, courses, t, skills,
}) => {
	const course = courses.find(c => c.id === courseId);
	const userCourse = skills.find(c => c.id === courseId);
	const completeCourse = { ...course, ...userCourse };
	const {
		learners, name, id, progress,
	} = completeCourse;
	return (
		<div className="course-popup-container">
			<div className="course-details">
				<img
					alt={name}
					className="course-icon"
					src={`https://api.sololearn.com/uploads/Courses/${id}.png`}
				/>
				<div className="course-info">
					<p className="course-name">{name}</p>
					<p className="learners-count">{numberFormatter(learners, true)} {t('learn.course-learners-format')}</p>
					{progress &&
						<LinearProgress
							color="#8BC34A"
							mode="determinate"
							value={progress * 100}
							style={{ backgroundColor: '#dedede' }}
						/>
					}
				</div>
			</div>
			<div className="course-popup-actions">
				<Link to={`/learn/course/${toSeoFriendly(name, 100)}`}>
					<FlatButton
						primary
						label={t('learn.open-course-action-tite')}
					/>
				</Link>
			</div>
		</div>
	);
};

export default CoursePopup;
