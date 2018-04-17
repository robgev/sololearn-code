import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import { Circle } from 'react-progressbar.js';
import 'styles/courseChip.scss';

const CustomWrapper = ({ children, className }) => (
	<span className={className}>
		{children}
	</span>
);

const CourseChip = ({
	id,
	alias,
	name,
	round,
	iconUrl,
	noName,
	disabled,
	progress,
	isCourse,
	itemType,
	size = 100,
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
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: size,
					width: size,
					backgroundColor: color,
					borderRadius: (isCourse || round) ? '100%' : 0,
					...(noBoxShadow ? { boxShadow: 'none' } : {}),
				}}
			>
				{ isCourse &&
					<Circle
						progress={progress}
						options={{
							color: '#9CCC65',
							strokeWidth: 4,
							trailColor: '#DCDCDE',
							trailWidth: 4,
						}}
						containerStyle={{
							width: size,
							height: size,
							position: 'absolute',
						}}
					/>
				}
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
