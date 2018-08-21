import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Progressbar from 'components/Progressbar';
import { slayItemTypes } from 'constants/ItemTypes';

import 'styles/components/CodePenCard.scss';
import ViewStats from './ViewStats';

const getProgress = (skills, courseId) => {
	const skill = skills.find(({ id }) => id === courseId);
	return skill ? skill.progress : 0;
};

const CodePenCard = ({
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
	<div className="code-pen-container">
		{title &&
				<div className="meta-info">
					<p>{title}</p>
				</div>
		}
		<Link
			to={`/learn/lesson/${itemType === slayItemTypes.courseLesson ? 'course-lesson' : 'user-lesson'}/${id}/${name}/1`}
			className="code-pen-wrapper"
		>
			<div className="image-wrapper" style={{ backgroundColor: color }}>
				{(itemType === slayItemTypes.course
						|| isCourses) &&
						<Progressbar percentage={getProgress(skills, id) * 100} />
				}
				<img
					src={iconUrl}
					alt="Course Icon"
					className={`card-image ${itemType === slayItemTypes.course || isCourses ? 'round' : ''}`}
				/>
				<div className="info-container">
					<span className={`course-name ${isCourses ? 'centered' : ''}`} title={name}>{name}</span>
					{(Number.isInteger(viewCount)
							&& Number.isInteger(comments)) &&
							<ViewStats
								color="white"
								views={viewCount}
								comments={comments}
								iconStyle={{ height: 18, width: 18 }}
							/>
					}
				</div>
			</div>
		</Link>
	</div>
);

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(CodePenCard);
