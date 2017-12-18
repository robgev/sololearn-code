import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { getCourseAliasById } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/courseCard.scss';
import ViewStats from './ViewStats';

const CourseCard = ({
	id,
	name,
	// color,
	userID,
	courses,
	iconUrl,
	itemType,
	userName,
	viewCount,
	comments,
}) => (
	<Link
		to={
			itemType === slayItemTypes.course ?
				`/learn/${getCourseAliasById(courses, id)}` :
				`/learn/slayLesson/${itemType}/${id}/1`
		}
		className="course-card-wrapper"
	>
		<Paper className="course-card-container">
			<img
				src={iconUrl}
				alt="Course Icon"
				className={`card-image ${itemType === slayItemTypes.course ? 'round' : ''}`}
			/>
			<div className="info-container">
				<p>{name}</p>
				<Link
					className="user-link"
					to={`/profile/${userID}`}
				>
					{userName}
				</Link>
				<ViewStats
					views={viewCount}
					comments={comments}
				/>
			</div>
		</Paper>
	</Link>
);

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseCard);
