import React from 'react';
import Paper from 'material-ui/Paper';

const collectionTypes = {
	course: 1,
	lesson: 2,
	courseLesson: 3,
};

const CourseChip = ({
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
	<div className="chip-container">
		<Paper
			style={{
				display: 'inline-block',
				height: 100,
				width: 100,
				borderRadius: round ? '100%' : 0,
			}}
		>
			<img
				src={iconUrl}
				alt="Course Icon"
				className={`chip-image ${round ? 'round' : ''}`}
			/>
		</Paper>
		<p className="course-name">{name}</p>
	</div>
);

export default CourseChip;
