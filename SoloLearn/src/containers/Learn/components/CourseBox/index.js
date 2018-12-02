import React from 'react';
import { connect } from 'react-redux';
import { toSeoFriendly } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';
import { Image, Container, CircularProgress, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink, ViewStats } from 'components/molecules';

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
}) => {
	const isRound = itemType === slayItemTypes.course || isCourses;
	return (
		<Container className="course-box-container">
			<ContainerLink
				to={itemType === 5 ? `/learn/collection/${id}` : `/learn/course/${toSeoFriendly(name)}`}
				className="course-card-wrapper"
			>
				<Container className="image-wrapper" style={{ backgroundColor: color }}>
					{ isRound &&
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
					{(Number.isInteger(viewCount)
						&& Number.isInteger(comments)) &&
						<ViewStats
							views={viewCount}
							comments={comments}
							iconStyle={{ height: 18, width: 18 }}
						/>
					}
				</Container>
			</ContainerLink>
		</Container>
	);
};

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseBox);
