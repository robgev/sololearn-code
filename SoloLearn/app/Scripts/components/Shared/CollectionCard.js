import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import 'styles/collectionCard.scss';
import CourseChip from './CourseChip';

// i18next
import { translate } from 'react-i18next';

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
	const collectionItems = isCourses ? courses.slice(0, 8) : items.slice(0, 8);
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
			<div className="courses-list">
				{
					collectionItems.map(lessonItem => (
						lessonItem.itemType !== 4 &&
						<CourseChip
							{...lessonItem}
							round={round}
							noName={noName}
							isCourse={isCourses}
							key={`${lessonItem.name}-${lessonItem.id}`}
						/>
					))
				}
			</div>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses });

const translatedCollectionCard = translate()(CollectionCard);

export default connect(mapStateToProps, null)(translatedCollectionCard);
