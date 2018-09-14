import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { getCourseNameById, toSeoFriendly } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/courseCard.scss';
import ViewStats from './ViewStats';

const CourseCard = ({
	id,
	title,
	name,
	style,
	color,
	small,
	userID,
	courses,
	iconUrl,
	itemType,
	minimal,
	userName,
	isCourses,
	viewCount,
	comments,
	className,
	wrapperStyle,
}) => (
	<Paper style={style} className={`course-card-container ${small ? 'small' : ''} ${className || ''}`}>
		{
			title &&
				<div className="meta-info">
					<p>{title}</p>
				</div>
		}
		<Link
			to={
				itemType === slayItemTypes.course || isCourses ?
					`/learn/course/${toSeoFriendly(getCourseNameById(courses, id))}` :
					`/learn/lesson/${itemType === slayItemTypes.courseLesson ? 'course-lesson' : 'user-lesson'}/${id}/${name}/1`
			}
			style={wrapperStyle}
			className="course-card-wrapper"
		>
			<div
				style={{ backgroundColor: color }}
				className={`course-card-image-container ${minimal ? 'minimal' : ''} ${itemType === slayItemTypes.course || isCourses ? 'round' : ''}`}
			>
				<img
					src={iconUrl}
					alt="Course Icon"
					className="card-image"
				/>
			</div>
			<div className="info-container">
				<p className="hoverable">{name}</p>
				<Link
					className="user-link hoverable"
					to={`/profile/${userID}`}
				>
					{userName}
				</Link>
				{(!minimal && (Number.isInteger(viewCount) && Number.isInteger(comments))) &&
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
