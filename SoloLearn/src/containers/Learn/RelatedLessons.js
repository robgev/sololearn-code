import React from 'react';
import CourseCard from 'components/CourseCard';
import CollectionCard from 'components/CollectionCard';
import SidebarCollectionCard from 'components/SidebarCollectionCard';

import 'styles/relatedLessons.scss';

// i18n
import { translate } from 'react-i18next';

const RelatedLessons = ({
	t,
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
				noViewMore
				name={t('lesson.implementations')}
				items={implementations}
			/>
		}
		{ nextLesson &&
			<CourseCard
				{...nextLesson}
				title={t('lesson.up-next')}
				className="up-next-course-card-container"
				style={{
					padding: 15,
					marginBottom: 0,
					paddingBottom: 0,
					boxShadow: 'none',
				}}
			/>
		}
		{	(relevantLessons && !!relevantLessons.length) &&
			<SidebarCollectionCard
				id={id}
				noViewMore
				title={t('lesson.see-also')}
				items={relevantLessons}
			/>
		}
		{	(lessonsByUser && !!lessonsByUser.length) &&
		<SidebarCollectionCard
			userID={userID}
			title={`${t('lesson.view-more-by-author')} ${userName}`}
			items={lessonsByUser.slice(0, 10)}
		/>
		}
	</div>
);

export default translate()(RelatedLessons);
