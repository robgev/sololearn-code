import React from 'react';
//import { Link } from 'react-router';
//import Progressbar from 'components/Progressbar';
import { toSeoFriendly } from 'utils';

import {
	Container,
	Link,
	Image,
	Progress,
	Title
} from 'components/atoms';
import { LanguageLabel } from 'components/molecules'

import 'styles/courseChip.scss';

const CustomWrapper = ({ children, className }) => (
	<Container className={className}>
		{children}
	</Container>
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

			to={customLink || (isCourse ? `/learn/course/${toSeoFriendly(name)}` : `/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${id}/${toSeoFriendly(name, 100)}/1`)}
		>
			<Container
				className={`course-chip-image-container ${(roundItem) ? 'round' : ''} ${noBoxShadow ? '' : 'with-shadow'}`}
				style={{
					height: size,
					...paperStyle,
				}}
			>
				{isCourse &&
					<Progress value={progress * 100} />
				}
				<Image
					src={iconUrl}
					alt="Course Icon"
					style={{
						backgroundColor: color,
					}}
					className={`chip-image ${(roundItem) ? 'round' : ''}`}
				/>
				{(!(roundItem) && language) &&
					<LanguageLabel language={language}/>
				}
			</Container>
			{!noName &&
				<Container className={`course-chip-info ${(roundItem) ? 'round-course-item' : ''}`}>
					<Title className="course-name">{name}</Title>
				</Container>
			}
		</WrapperComponent>
	);
};

export default CourseChip;
