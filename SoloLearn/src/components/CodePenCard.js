import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { slayItemTypes } from 'constants/ItemTypes';
import LinearProgress from 'material-ui/LinearProgress';
import { getLanguageColor, toSeoFriendly } from 'utils';

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
	language,
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
			to={
				itemType === slayItemTypes.course
					? `/learn/course/${toSeoFriendly(name)}`
					: `/learn/lesson/${itemType === slayItemTypes.courseLesson ? 'course-lesson' : 'user-lesson'}/${id}/${name}/1`}
			className="code-pen-wrapper"
		>
			<div className="image-wrapper" style={{ backgroundColor: itemType === slayItemTypes.course ? getLanguageColor(language) : color }}>
				{itemType === slayItemTypes.course &&
					<LinearProgress
						color="#8BC34A"
						mode="determinate"
						value={getProgress(skills, id) * 100}
						style={{
							position: 'absolute',
							bottom: 52,
							backgroundColor: '#DCDCDE',
							borderRadius: 0,
						}}
					/>
				}
				<img
					alt="Course Icon"
					className="card-image"
					src={itemType === slayItemTypes.course
						? `https://api.sololearn.com/uploads/Courses/${id}_web.png`
						: iconUrl
					}
				/>
				<div className="info-container">
					<span className="course-name" title={name}>{name}</span>
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
