import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import { CourseCard } from 'containers/Learn/components';
import { Container, List, ListItem, HorizontalDivider, Heading } from 'components/atoms';
import { EmptyCard, ViewMoreLink } from 'components/molecules';

const SidebarCollection = ({
	t,
	title,
	items,
	userID,
	bookmarks,
	noViewMore = false,
}) => (
	<Container>
		<Heading>{title}</Heading>
		{
			items.length === 0
				? <EmptyCard />
				: (
					<List>
						{
							items.map(lessonItem => (
								<Fragment>
									<ListItem>
										<CourseCard
											minimal
											{...lessonItem}
											wrapperStyle={{ padding: 0 }}
											className="collection-card-chip"
											style={{ padding: 0, boxShadow: 'none' }}
											key={`${lessonItem.name}-${lessonItem.id}`}
										/>
									</ListItem>
									<HorizontalDivider />
								</Fragment>
							))
						}
					</List>
				)
		}
		{!noViewMore && items.length > 0 && (
			<ViewMoreLink to={bookmarks ? 'learn/bookmarks' : `/learn/more/author/${userID}`} >
				{t('common.loadMore')}
			</ViewMoreLink>
		)
		}
	</Container>
);

export default translate()(SidebarCollection);
