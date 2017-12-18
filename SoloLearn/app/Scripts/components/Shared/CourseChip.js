import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

const CourseChip = ({
	id,
	alias,
	name,
	round,
	// color,
	iconUrl,
	noName,
	isCourse,
	itemType,
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
				borderRadius: (isCourse || round) ? '100%' : 0,
			}}
		>
			<img
				src={iconUrl}
				alt="Course Icon"
				className={`chip-image ${(isCourse || round) ? 'round' : ''}`}
			/>
		</Paper>
		{!noName &&
			<p className="course-name">{name}</p>
		}
	</Link>
);

export default CourseChip;
