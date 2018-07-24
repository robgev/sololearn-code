import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Circle } from 'react-progressbar.js';
import { toSeoFriendly } from 'utils';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/courseBox.scss';
import ViewStats from './ViewStats';

const getProgress = (skills, courseId) => {
	const skill = skills.find(({ id }) => id === courseId);
	return skill ? skill.progress : 0;
};

const CourseBox = ({
	id,
	title,
	name,
	color,
	skills,
	iconUrl,
	itemType,
	isCourses,
	viewCount,
	comments,
}) => (
	<div className="course-box-container">
		{title &&
			<div className="meta-info">
				<p>{ title }</p>
			</div>
		}
		<Link
			to={`/learn/${toSeoFriendly(name, 100)}/${id}/${itemType}`}
			className="course-card-wrapper"
		>
			<div className="image-wrapper" style={{ backgroundColor: color }}>
				{ (itemType === slayItemTypes.course || isCourses) &&
				<Circle
					progress={getProgress(skills, id)}
					options={{
						color: '#9CCC65',
						strokeWidth: 4,
						trailColor: '#DCDCDE',
						trailWidth: 4,
					}}
					containerStyle={{
						width: '100%',
						height: '100%',
						position: 'absolute',
						top: 0,
					}}
				/>
				}
				<img
					src={iconUrl}
					alt="Course Icon"
					className={`card-image ${(itemType === slayItemTypes.course || isCourses) ? 'round' : ''}`}
				/>
			</div>
			<div className="info-container">
				<span className={`course-name ${isCourses ? 'centered' : ''}`} title={name}>{name}</span>
				{ (Number.isInteger(viewCount) && Number.isInteger(comments)) &&
					<ViewStats
						views={viewCount}
						comments={comments}
						iconStyle={{ height: 18, width: 18 }}
					/>
				}
			</div>
		</Link>
	</div>
);

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(CourseBox);
