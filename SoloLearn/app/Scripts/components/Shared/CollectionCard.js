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

const CollectionCard = ({
	t,
	id,
	type,
	name,
	items,
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
				infinite
				dots={false}
				speed={500}
				swipeToSlide
				slidesToShow={8}
				className="courses-list"
				responsive={[
					{ breakpoint: 440, settings: { slidesToShow: 1 } },
					{ breakpoint: 640, settings: { slidesToShow: 2 } },
					{ breakpoint: 840, settings: { slidesToShow: 3 } },
					{ breakpoint: 1040, settings: { slidesToShow: 4 } },
					{ breakpoint: 1240, settings: { slidesToShow: 5 } },
					{ breakpoint: 1440,  settings: { slidesToShow: 6 } },
					{ breakpoint: 1640,  settings: { slidesToShow: 7 } }
				]}
			>
				{
					collectionItems.map(lessonItem => (
						lessonItem.itemType !== 4 &&
						<div key={`${lessonItem.name}-${lessonItem.id}`}>
							<CourseChip
								{...lessonItem}
								round={round}
								noName={noName}
								isCourse={isCourses}
							/>
						</div>
					))
				}
			</Slider>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses });

const translatedCollectionCard = translate()(CollectionCard);

export default connect(mapStateToProps, null)(translatedCollectionCard);
