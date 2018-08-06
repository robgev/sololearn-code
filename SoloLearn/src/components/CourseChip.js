import React from 'react';
import { Link } from 'react-router';
import { toSeoFriendly } from 'utils';
import { Circle } from 'react-progressbar.js';
import 'styles/courseChip.scss';

const CustomWrapper = ({ children, className }) => (
	<span className={className}>
		{children}
	</span>
);

const CourseChip = ({
	id,
	name,
	round,
	iconUrl,
	noName,
	disabled,
	progress,
	isCourse,
	language,
	size = 95,
	className,
	paperStyle,
	customLink,
	itemType = 1,
	noBoxShadow,
	wrapperStyle,
	color = 'white',
}) => {
	const WrapperComponent = disabled ? CustomWrapper : Link;
	const roundItem = isCourse || round;
	return (
		<WrapperComponent
			style={{
				backgroundColor: roundItem ? 'transparent' : color,
				...wrapperStyle,
			}}
			className={`chip-container ${(roundItem) ? 'round' : ''} ${className}`}
			to={customLink || (isCourse ? `/learn/${itemType === 1 ? 'course' : 'lessons'}/${name}/${id}` : `/learn/lesson/${id}/1`)}
		>
			<div
				className={`course-chip-image-container ${(roundItem) ? 'round' : ''} ${noBoxShadow ? '' : 'with-shadow'}`}
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
					style={{
						backgroundColor: color,
					}}
					className={`chip-image ${(roundItem) ? 'round' : ''}`}
				/>
				{ (!(roundItem) && language) &&
					<span className="language-tag">{language}</span>
				}
			</div>
			{!noName &&
			<div className={`course-chip-info ${(roundItem) ? 'round-course-item' : ''}`}>
				<p className="course-name">{name}</p>
			</div>
			}
		</WrapperComponent>
	);
};

export default CourseChip;
