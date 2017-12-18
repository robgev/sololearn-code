import React from 'react';
import CourseCard from 'components/Shared/CourseCard';
import CollectionCard from 'components/Shared/CollectionCard';

import 'styles/relatedLessons.scss';

const RelatedLessons = ({
	id,
	nextLesson,
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
			<CourseCard {...relevantLessons} />
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
		<div className="by-author" />
	</div>
);

export default RelatedLessons;
