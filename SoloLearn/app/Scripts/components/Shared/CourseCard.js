import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

import 'styles/courseCard.scss';
import ViewStats from './ViewStats';

const CourseCard = ({
	id,
	type,
	name,
	color,
	round,
	userID,
	iconUrl,
	itemType,
	language,
	userName,
	viewCount,
	comments,
	avatarUrl,
}) => (
	<Paper
		className="course-card-container"
	>
		<img
			src={iconUrl}
			alt="Course Icon"
			className="card-image"
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
);

export default CourseCard;
