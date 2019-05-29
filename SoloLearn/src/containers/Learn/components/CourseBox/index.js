import React from 'react';
import { connect } from 'react-redux';
import { toSeoFriendly } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';
import { Image, Container, CircularProgress, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink, ViewStats } from 'components/molecules';
import { withCourses } from 'utils/with';

import './styles.scss';

const CourseBox = ({
	id,
	name,
	color,
	iconUrl,
	itemType,
	isCourses,
	viewCount,
	comments,
	progress,
	getCourseAliasById,
}) => {
	const isRound = itemType === slayItemTypes.course || isCourses;
	return (
		<Container className="course-box-container">
			<ContainerLink
				to={itemType !== slayItemTypes.course ? `/collections/${id}` : `/learn/${toSeoFriendly(getCourseAliasById(id))}`}
				className="course-card-wrapper"
			>
				<Container className="image-wrapper" style={{ backgroundColor: color }}>
					{isRound &&
						<CircularProgress percentage={progress * 100} />
					}
					<Image
						src={iconUrl}
						alt="Course Icon"
						className={`card-image ${isRound ? 'round' : ''}`}
					/>
				</Container>
				<Container className="info-container">
					<SecondaryTextBlock className={`course-name ${isCourses ? 'centered' : ''}`} title={name}>{name}</SecondaryTextBlock>

				</Container>
			</ContainerLink>
		</Container>
	);
};

export default withCourses(CourseBox);
