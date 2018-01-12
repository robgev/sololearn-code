import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import 'styles/courseChip.scss';

const CourseChip = ({
	id,
	alias,
	name,
	round,
	iconUrl,
	noName,
	isCourse,
	itemType,
	customLink,
	noBoxShadow,
	color = 'white',
}) => (
	<Link
		className="chip-container"
		to={customLink || (isCourse ? `/learn/${alias}` : `/learn/slayLesson/${itemType}/${id}/1`)}
	>
		<Paper
			style={{
				display: 'inline-block',
				height: 100,
				width: 100,
				backgroundColor: color,
				borderRadius: (isCourse || round) ? '100%' : 0,
				...(noBoxShadow ? { boxShadow: 'none' } : {}),
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
