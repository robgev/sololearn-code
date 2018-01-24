import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import 'styles/courseChip.scss';

const CustomWrapper = ({ children, className }) => (
	<div className={className}>
		{children}
	</div>
);

const CourseChip = ({
	id,
	alias,
	name,
	round,
	iconUrl,
	noName,
	disabled,
	isCourse,
	itemType,
	customLink,
	noBoxShadow,
	color = 'white',
}) => {
	const WrapperComponent = disabled ? CustomWrapper : Link;
	return (
		<WrapperComponent
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
		</WrapperComponent>
	);
};

export default CourseChip;
