import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import Paper from 'material-ui/Paper';
import { translate } from 'react-i18next';

import 'styles/collectionCard.scss';
import CourseChip from './CourseChip';

const collectionTypes = {
	slayLessons: 1,
	courses: 2,
};

const generateBreakpoints = (numberOfItems, roundItems) => {
	const breakpointValues = [ 1224, 768, 320 ];
	const initialNumberOfShownItems = roundItems ? 4 : 3;
	return breakpointValues.map((currentPoint, index) => {
		const slidesToShow = initialNumberOfShownItems - (index + 1);
		return {
			breakpoint: currentPoint,
			settings: {
				infinite: numberOfItems > slidesToShow,
				slidesToShow,
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
	userID,
	description,
	round = false,
	noName = false,
	noViewMore = false,
}) => {
	// lessons are the old Sololearn-created courses, like learn HTML, C# etc.
	const isCourses = type === collectionTypes.courses;
	const slidesToShow = (isCourses || round) ? 4 : 3;
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
			<div className={`meta-info ${!description ? 'big-padding-bottom' : ''}`}>
				<p>{ name }</p>
				{ !noViewMore &&
				<Link to={userID ? `/learn/more/author/${userID}` : `/learn/more/${id}`} >
					{t('common.loadMore')}
				</Link>
				}
			</div>
			{ description &&
			<p className="course-description">{description}</p>
			}
			<Slider
				arrows
				draggable
				dots={false}
				speed={500}
				swipeToSlide
				className="courses-list"
				slidesToShow={slidesToShow}
				infinite={items.length > slidesToShow}
				responsive={generateBreakpoints(items.length, isCourses || round)}
			>
				{
					items.map(lessonItem => (
						lessonItem.itemType !== 4 &&
							<div className="course-chip-wrapper" key={`${lessonItem.name}-${lessonItem.id}`}>
								<CourseChip
									{...lessonItem}
									round={round}
									noName={noName}
									isCourse={isCourses}
									className="collection-card-chip"
									noBoxShadow={!(isCourses && round)}
								/>
							</div>
					))
				}
			</Slider>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses, skills: state.userProfile.skills });

export default connect(mapStateToProps, null)(translate()(CollectionCard));
