import React from 'react';
//import { Link } from 'react-router';
import { connect } from 'react-redux';
//import Paper from 'material-ui/Paper';
import { getCourseNameById, toSeoFriendly } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import { Container, PaperContainer, Link, Image, SecondaryTextBlock, Title } from 'components/atoms';

import 'styles/courseCard.scss';
import ViewStats from './ViewStats';

const CourseCard = ({
	id,
	title,
	name,
	style,
	color,
	small,
	userID,
	courses,
	iconUrl,
	itemType,
	minimal,
	userName,
	isCourses,
	viewCount,
	comments,
	className,
	wrapperStyle,
}) => (
	<PaperContainer className={`course-card-container ${small ? 'small' : ''} ${className || ''}`}>
		{
			title &&
				<Container className="meta-info">
					<SecondaryTextBlock>{title}</SecondaryTextBlock>
				</Container>
		}
		<Link
			to={
				itemType === slayItemTypes.course || isCourses ?
					`/learn/course/${toSeoFriendly(getCourseNameById(courses, id))}` :
					`/learn/lesson/${itemType === slayItemTypes.courseLesson ? 'course-lesson' : 'user-lesson'}/${id}/${toSeoFriendly(name, 100)}/1`
			}
			className="course-card-wrapper"
		>
			<Container
				style={{ backgroundColor: color }}
				className={`course-card-image-container ${minimal ? 'minimal' : ''} ${itemType === slayItemTypes.course || isCourses ? 'round' : ''}`}
			>
				<Image
					src={iconUrl}
					alt="Course Icon"
					className="card-image"
				/>
			</Container>
			<Container className="info-container">
				<Title className="hoverable">{name}</Title>
				<Link
					className="user-link hoverable"
					to={`/profile/${userID}`}
				>
					{userName}
				</Link>
				{(!minimal && (Number.isInteger(viewCount) && Number.isInteger(comments))) &&
				<ViewStats
							views={viewCount}
							comments={comments}
						/>
				}
			</Container>
		</Link>
	</PaperContainer>
);

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseCard);
