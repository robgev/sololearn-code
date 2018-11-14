import React from 'react';
import { toSeoFriendly } from 'utils';
import { Container, Image, CircularProgress, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import './styles.scss';

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
	const WrapperComponent = disabled ? Container : ContainerLink;
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
					<CircularProgress percentage={progress * 100} />
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
					<SecondaryTextBlock className="language-tag">{language}</SecondaryTextBlock>
				}
			</Container>
			{!noName &&
				<Container className={`course-chip-info ${(roundItem) ? 'round-course-item' : ''}`}>
					<SecondaryTextBlock className="course-name">{name}</SecondaryTextBlock>
				</Container>
			}
		</WrapperComponent>
	);
};

export default CourseChip;
