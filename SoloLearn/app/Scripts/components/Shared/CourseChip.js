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
	language,
	size = 95,
	className,
	paperStyle,
	customLink,
	noBoxShadow,
	wrapperStyle,
	color = 'white',
}) => {
	const WrapperComponent = disabled ? CustomWrapper : Link;
	return (
		<WrapperComponent
			style={{
				backgroundColor: color,
				...wrapperStyle,
			}}
			className={`chip-container ${(isCourse || round) ? 'round' : ''} ${className}`}
			to={customLink || (isCourse ? `/learn/${alias}` : `/learn/slayLesson/${itemType}/${id}/1`)}
		>
			<div
				className={`course-chip-image-container ${(isCourse || round) ? 'round' : ''} ${noBoxShadow ? '' : 'with-shadow'}`}
				style={{
					height: size,
					...paperStyle,
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
				{ (!isCourse && language) &&
					<span className="language-tag">{language}</span>
				}
			</div>
			{!noName &&
			<div className={`course-chip-info ${(isCourse || round) ? 'round-course-item' : ''}`}>
				<p className="course-name">{name}</p>
			</div>
			}
		</WrapperComponent>
	);
};

export default CourseChip;
