import React from 'react';
import { connect } from 'react-redux';
import { slayItemTypes } from 'constants/ItemTypes';
import { AppDefaults } from 'api/service';
import { getLanguageColor, toSeoFriendly } from 'utils';

import { Container, Progress, Image, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink, ViewStats } from 'components/molecules';
import { withCourses } from 'utils/with';
import './styles.scss';

const getProgress = (skills, courseId) => {
	const skill = skills.find(({ id }) => id === courseId);
	return skill ? skill.progress : 0;
};

const CodePenCard = ({
	id,
	color,
	name,
	skills,
	iconUrl,
	itemType,
	language,
	viewCount,
	comments,
	getCourseAliasById,
}) => (
	<Container className="code-pen-container">
		<ContainerLink
			to={
				itemType === slayItemTypes.course
					? `/learn/${toSeoFriendly(getCourseAliasById(id))}`
					: `/learn/${id}/${toSeoFriendly(name, 100)}/1`}
			className="code-pen-wrapper"
		>
			<Container className="image-wrapper" style={{ backgroundColor: itemType === slayItemTypes.course ? getLanguageColor(language) : color }}>
				{itemType === slayItemTypes.course &&
					<Progress value={getProgress(skills, id) * 100}	/>
				}
				<Image
					alt="Course Icon"
					className="card-image"
					src={itemType === slayItemTypes.course
						? `${AppDefaults.downloadHost}/Courses/${id}_web.png`
						: iconUrl
					}
				/>
				<Container className="info-container">
					<SecondaryTextBlock className="course-name" title={name}>{name}</SecondaryTextBlock>
					{(Number.isInteger(viewCount)
							&& Number.isInteger(comments)) &&
							<ViewStats
								color="white"
								views={viewCount}
								comments={comments}
								iconStyle={{ height: 18, width: 18 }}
							/>
					}
				</Container>
			</Container>
		</ContainerLink>
	</Container>
);

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default withCourses(connect(mapStateToProps)(CodePenCard));
