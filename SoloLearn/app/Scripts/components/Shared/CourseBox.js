import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { getCourseAliasById } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/courseBox.scss';
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
	userName,
	isCourses,
	viewCount,
	comments,
}) => (
	<div className="course-box-container">
		{title &&
			<div className="meta-info">
				<p>{ title }</p>
			</div>
		}
		<Link
			to={
				itemType === slayItemTypes.course || isCourses ?
					`/learn/${getCourseAliasById(courses, id)}` :
					`/learn/slayLesson/${itemType}/${id}/1`
			}
			className="course-card-wrapper"
		>
			<div className="image-wrapper" style={{ backgroundColor: color }}>
				<img
					src={iconUrl}
					alt="Course Icon"
					className={`card-image ${itemType === slayItemTypes.course || isCourses ? 'round' : ''}`}
				/>
			</div>
			<div className="info-container">
				<span className="wrapped-text course-name" title={name}>{name}</span>
				<Link
					className="wrapped-text user-link"
					to={`/profile/${userID}`}
					title={userName}
				>
					{userName}
				</Link>
				{ (Number.isInteger(viewCount) && Number.isInteger(comments)) &&
					<ViewStats
						views={viewCount}
						comments={comments}
						iconStyle={{ height: 18, width: 18 }}
					/>
				}
			</div>
		</Link>
	</div>
);

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseCard);
