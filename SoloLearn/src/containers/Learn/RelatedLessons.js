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
				title={t('lesson.up-next')}
				{...nextLesson}
			/>
		}
		{	(relevantLessons && !!relevantLessons.length) &&
			(relevantLessons.length > 1 ?
				<SidebarCollectionCard
					id={id}
					noViewMore
					title={t('lesson.see-also')}
					items={relevantLessons}
				/> :
				<CourseCard
					title={t('lesson.see-also')}
					{...relevantLessons[0]}
				/>
			)
		}
		{	(lessonsByUser && !!lessonsByUser.length) &&
			(lessonsByUser.length > 1 ?
				<SidebarCollectionCard
					userID={userID}
					title={`${t('lesson.view-more-by-author')} ${userName}`}
					items={lessonsByUser}
				/> :
				<CourseCard
					title={`${t('lesson.view-more-by-author')} ${userName}`}
					{...lessonsByUser[0]}
				/>
			)
		}
	</div>
);

export default translate()(RelatedLessons);
