import React from 'react';
import { Link } from 'react-router';
import Progressbar from 'components/Progressbar';
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

			to={customLink || (isCourse ? `/learn/course/${name}` : `/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${id}/${name}/1`)}
		>
			<div
				className={`course-chip-image-container ${(roundItem) ? 'round' : ''} ${noBoxShadow ? '' : 'with-shadow'}`}
				style={{
					height: size,
					...paperStyle,
				}}
			>
				{isCourse &&
					<Progressbar percentage={progress * 100} />
				}
				<img
					src={iconUrl}
					alt="Course Icon"
					style={{
						backgroundColor: color,
					}}
					className={`chip-image ${(roundItem) ? 'round' : ''}`}
				/>
				{(!(roundItem) && language) &&
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
