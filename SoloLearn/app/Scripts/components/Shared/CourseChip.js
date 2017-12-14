import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

const CourseChip = ({
	id,
	type,
	alias,
	name,
	color,
	userID,
	iconUrl,
	isCourse,
	itemType,
	language,
	userName,
	viewCount,
	comments,
	avatarUrl,
}) => (
	<Link
		className="chip-container"
		to={isCourse ? `/learn/${alias}` : `/learn/slayLesson/${itemType}/${id}/1`}
	>
		<Paper
			style={{
				display: 'inline-block',
				height: 100,
				width: 100,
				borderRadius: isCourse ? '100%' : 0,
			}}
		>
			<img
				src={iconUrl}
				alt="Course Icon"
				className={`chip-image ${isCourse ? 'round' : ''}`}
			/>
		</Paper>
		<p className="course-name">{name}</p>
	</Link>
);

export default CourseChip;
