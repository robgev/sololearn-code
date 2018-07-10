import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { getCourseNameById } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/courseCard.scss';
import ViewStats from './ViewStats';

const CourseCard = ({
	id,
	title,
	name,
	color,
	userID,
	courses,
	iconUrl,
	itemType,
	minimal,
	userName,
	isCourses,
	viewCount,
	comments,
}) => (
	<Paper className="course-card-container">
		{title &&
			<div className="meta-info">
				<p>{ title }</p>
			</div>
		}
		<Link
			to={
				itemType === slayItemTypes.course || isCourses ?
					`/learn/${getCourseNameById(courses, id)}/${id}/1` :
					`/learn/slayLesson/${itemType}/${id}/1`
			}
			className="course-card-wrapper"
		>
			<div style={{ backgroundColor: color }}>
				<img
					src={iconUrl}
					alt="Course Icon"
					className={`card-image ${minimal ? 'minimal' : ''} ${itemType === slayItemTypes.course || isCourses ? 'round' : ''}`}
				/>
			</div>
			<div className="info-container">
				<p>{name}</p>
				<Link
					className="user-link"
					to={`/profile/${userID}`}
				>
					{userName}
				</Link>
				{ (!minimal && (Number.isInteger(viewCount) && Number.isInteger(comments))) &&
					<ViewStats
						views={viewCount}
						comments={comments}
					/>
				}
			</div>
		</Link>
	</Paper>
);

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseCard);
