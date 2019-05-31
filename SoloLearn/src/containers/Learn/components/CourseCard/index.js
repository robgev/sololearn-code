import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toSeoFriendly } from 'utils';
import { getCourseAliasById } from 'reducers/courses.reducer';
import { slayItemTypes } from 'constants/ItemTypes';

import { Heading, Container, Link, Image, SecondaryTextBlock, Title } from 'components/atoms';
import { ViewStats, UsernameLink, ModBadge } from 'components/molecules';

import './styles.scss';

const CourseCard = ({
	id,
	title,
	name,
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
	badge,
}) => (
	<Container className={`course-card-container ${small ? 'small' : ''} ${className || ''}`}>
		{
			title &&
				<Fragment>
					{small
						? <Heading>{title}</Heading>
						: (
							<Container className="meta-info">
								<SecondaryTextBlock>{title}</SecondaryTextBlock>
							</Container>
						)
					}
				</Fragment>
		}
		<Link
			to={
				itemType === slayItemTypes.course || isCourses ?
					`/learn/${toSeoFriendly(getCourseAliasById(courses, id))}` :
					`/learn/${id}/${toSeoFriendly(name, 100)}/1`
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
				<Container>
					<UsernameLink to={`/profile/${userID}`}>
						{userName}
					</UsernameLink>
					<ModBadge
						className="badge"
						badge={badge}
					/>
				</Container>
				{(!minimal && (Number.isInteger(viewCount) && Number.isInteger(comments))) &&
				<ViewStats
							views={viewCount}
							comments={comments}
						/>
				}
			</Container>
		</Link>
	</Container>
);

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CourseCard);
