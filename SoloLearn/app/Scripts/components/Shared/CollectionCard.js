import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Slider from 'react-slick';
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

const generateBreakpoints = (collectionItems) => {
	const breakpointValues = [ 1640, 1440, 1240, 1040, 840, 640, 440 ];
	const initialNumberOfShownItems = 7;
	return breakpointValues.map((currentPoint, index) => {
		const slidesToShow = initialNumberOfShownItems - (index + 1);
		return {
			breakpoint: currentPoint,
			settings: {
				slidesToShow,
				infinite: collectionItems.length > slidesToShow,
			},
		};
	});
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
			style={{
				padding: 10,
				width: '100%',
				marginBottom: 10,
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
			<Slider
				dots={false}
				speed={500}
				swipeToSlide
				arrows={false}
				infinite={false}
				slidesToShow={7}
				draggable={false}
				className="courses-list"
				responsive={generateBreakpoints(collectionItems)}
			>
				{
					collectionItems.map((lessonItem) => {
						const foundSkill = isCourses
							? skills.find(({ id: skillId }) => lessonItem.id === skillId)
							: null;
						const progress = foundSkill ? foundSkill.progress : 0;
						return (
							lessonItem.itemType !== 4 &&
							<div key={`${lessonItem.name}-${lessonItem.id}`}>
								<CourseChip
									{...lessonItem}
									round={round}
									noName={noName}
									isCourse={isCourses}
									progress={progress}
								/>
							</div>
						);
					})
				}
			</Slider>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(translate()(CollectionCard));
