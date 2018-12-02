import React from 'react';
import { CollectionCard, SidebarCollectionCard, CourseCard } from 'containers/Learn/components';
import { translate } from 'react-i18next';
import { FlexBox } from 'components/atoms';
import { EmptyCard } from 'components/molecules';

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
	(
		(implementations && implementations.length)
		|| (relevantLessons && relevantLessons.length)
		|| (lessonsByUser && lessonsByUser.length)
		|| nextLesson)
		? (
			<FlexBox column justifyBetween>
				{	implementations.length &&
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
				{	relevantLessons.length &&
				<SidebarCollectionCard
					id={id}
					noViewMore
					title={t('lesson.see-also')}
					items={relevantLessons}
				/>
				}
				{	lessonsByUser.length &&
				<SidebarCollectionCard
					userID={userID}
					title={`${t('lesson.view-more-by-author')} ${userName}`}
					items={lessonsByUser.slice(0, 10)}
				/>
				}
			</FlexBox>
		)
		: <EmptyCard />
);

export default translate()(RelatedLessons);
