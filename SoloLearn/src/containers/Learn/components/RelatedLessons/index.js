import React from 'react';
import { CollectionCard, SidebarCollectionCard, CourseCard } from 'containers/Learn/components';
import { translate } from 'react-i18next';
import { Container } from 'components/atoms';

import './styles.scss';

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
	<Container className="related-container">
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
				small
				{...nextLesson}
				title={t('lesson.up-next')}
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
	</Container>
);

export default translate()(RelatedLessons);
