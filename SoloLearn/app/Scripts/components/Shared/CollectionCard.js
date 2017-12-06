import React from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import CourseChip from './CourseChip';

import 'styles/collectionCard.scss';

const collectionTypes = {
	course: 1,
	lesson: 2,
	courseLesson: 3,
};

const CollectionCard = ({
	id,
	type,
	name,
	items,
	courses,
}) => {
	// lessons are the old Sololearn-created courses, like learn HTML, C# etc.
	const isLessons = type === collectionTypes.lesson;
	const collectionItems = isLessons ? courses.slice(0, 8) : items.slice(0, 8);
	return (
		<Paper
			style={{
				padding: 10,
				marginBottom: 10,
			}}
		>
			<div className="meta-info">
				<p>{ name }</p>
				<FlatButton label="Load more" />
			</div>
			<div className="courses-list">
				{
					collectionItems.map(lessonItem => (
						<CourseChip round={isLessons} {...lessonItem} />
					))
				}
			</div>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CollectionCard);
