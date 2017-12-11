import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import 'styles/collectionCard.scss';
import CourseChip from './CourseChip';

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
				width: '100%',
				marginBottom: 10,
			}}
		>
			<div className="meta-info">
				<p>{ name }</p>
				<FlatButton
					label="Load more"
					containerElement={<Link to={`/learn/more/${id}`} />}
				/>
			</div>
			<div className="courses-list">
				{
					collectionItems.map(lessonItem => (
						<CourseChip
							{...lessonItem}
							isLesson={isLessons}
							key={lessonItem.name}
						/>
					))
				}
			</div>
		</Paper>
	);
};

const mapStateToProps = state => ({ courses: state.courses });

export default connect(mapStateToProps, null)(CollectionCard);
