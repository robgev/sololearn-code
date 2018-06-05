import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { translate } from 'react-i18next';
// i18next

import 'styles/collectionCard.scss';
import CourseChip from './CourseChip';

const collectionTypes = {
	slayLessons: 1,
	courses: 2,
};

const CollectionCard = ({
	t,
	id,
	type,
	name,
	items,
	skills,
	userID,
	courses,
	round = false,
	noName = false,
	noViewMore = false,
}) => {
	// lessons are the old Sololearn-created courses, like learn HTML, C# etc.
	const isCourses = type === collectionTypes.courses;
	const collectionItems = isCourses ? courses : items;
	return (
		<Paper
			zDepth={1}
			style={{
				padding: 15,
				width: '100%',
				marginBottom: 10,
				overflow: 'hidden',
			}}
		>
			<div className="meta-info">
				<p>{ name }</p>
				{ !noViewMore &&
					<FlatButton
						label={t('common.loadMore')}
						containerElement={
							<Link to={userID ? `/learn/more/author/${userID}` : `/learn/more/${id}`} />
						}
					/>
				}
			</div>
			<div className="courses-list">
				{
					collectionItems.map((lessonItem) => {
						const foundSkill = isCourses
							? skills.find(({ id: skillId }) => lessonItem.id === skillId)
							: null;
						const progress = foundSkill ? foundSkill.progress : 0;
						return (
							lessonItem.itemType !== 4 &&
							<div className="course-chip-wrapper" key={`${lessonItem.name}-${lessonItem.id}`}>
								<CourseChip
									{...lessonItem}
									round={round}
									noName={noName}
									isCourse={isCourses}
									progress={progress}
									className="collection-card-chip"
									paperStyle={{ width: 85, height: 85 }}
								/>
							</div>
						);
					})
				}
			</div>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(translate()(CollectionCard));
