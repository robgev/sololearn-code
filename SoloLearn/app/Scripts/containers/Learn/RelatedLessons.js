import React from 'react';
import CourseCard from 'components/Shared/CourseCard';
import CollectionCard from 'components/Shared/CollectionCard';

import 'styles/relatedLessons.scss';

const RelatedLessons = ({
	id,
	userID,
	userName,
	nextLesson,
	lessonsByUser,
	relevantLessons,
	implementations,
}) => (
	<div className="related-container">
		{	(implementations && !!implementations.length) &&
			<CollectionCard
				round
				id={id}
				noName
				name="Implementations"
				items={implementations}
			/>
		}
		{ nextLesson &&
			<CourseCard
				title="Up next"
				{...nextLesson}
			/>
		}
		{	(relevantLessons && !!relevantLessons.length) &&
			(relevantLessons.length > 1 ?
				<CollectionCard
					id={id}
					name="See also"
					items={relevantLessons}
				/> :
				<CourseCard
					title="See also"
					{...relevantLessons[0]}
				/>
			)
		}
		{	(lessonsByUser && !!lessonsByUser.length) &&
			(lessonsByUser.length > 1 ?
				<CollectionCard
					userID={userID}
					name={`More by ${userName}`}
					items={lessonsByUser}
				/> :
				<CourseCard
					title={`More by ${userName}`}
					{...lessonsByUser[0]}
				/>
			)
		}
	</div>
);

export default RelatedLessons;
