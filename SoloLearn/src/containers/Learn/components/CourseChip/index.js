import React from 'react';
import { toSeoFriendly } from 'utils';
import { Container, Image, CircularProgress, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import { getCourseAliasById } from 'reducers/courses.reducer';
import { connect } from 'react-redux';
import './styles.scss';

const mapStateToProps = state => ({
	courses: state.courses,
});

const CourseChip = ({
	id,
	courses,
	name,
	round,
	iconUrl,
	noName,
	disabled,
	progress,
	isCourse,
	language,
	size = 85,
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
			style={wrapperStyle}
			className={`chip-container ${(roundItem) ? 'round' : ''} ${className}`}
			to={customLink || (isCourse ? `/learn/course/${toSeoFriendly(getCourseAliasById(courses, id))}` : `/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${id}/${toSeoFriendly(name, 100)}/1`)}
		>
			<Container
				className={`course-chip-image-container ${(roundItem) ? 'round' : ''} ${noBoxShadow ? '' : 'with-shadow'}`}
				style={{
					height: size,
					backgroundColor: roundItem ? 'transparent' : color,
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

export default connect(mapStateToProps)(CourseChip);
