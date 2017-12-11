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
	isLesson,
	itemType,
	language,
	userName,
	viewCount,
	comments,
	avatarUrl,
}) => (
	<Link
		className="chip-container"
		to={isLesson ? `/learn/${alias}` : `/learn/${id}`}
	>
		<Paper
			style={{
				display: 'inline-block',
				height: 100,
				width: 100,
				borderRadius: isLesson ? '100%' : 0,
			}}
		>
			<img
				src={iconUrl}
				alt="Course Icon"
				className={`chip-image ${isLesson ? 'round' : ''}`}
			/>
		</Paper>
		<p className="course-name">{name}</p>
	</Link>
);

export default CourseChip;
