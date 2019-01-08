import React, { Fragment } from 'react';
import { translate } from 'react-i18next';

import { CourseCard } from 'containers/Learn/components';
import { FlexBox, List, ListItem, HorizontalDivider, Heading } from 'components/atoms';
import { EmptyCard, ViewMoreLink } from 'components/molecules';

import './styles.scss';

const SidebarCollection = ({
	t,
	title,
	items,
	userID,
	bookmarks,
	noViewMore = false,
}) => (
	<FlexBox column justify>
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
		{!noViewMore && items.length > 1 && (
			<ViewMoreLink className="learn-sidebar_view-more" to={bookmarks ? 'learn/bookmarks' : `/learn/more/author/${userID}`} >
				{t('common.loadMore')}
			</ViewMoreLink>
		)
		}
	</FlexBox>
);

export default translate()(SidebarCollection);
