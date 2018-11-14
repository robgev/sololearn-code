import React from 'react';
import { translate } from 'react-i18next';

import { CourseCard } from 'containers/Learn/components';
import { Container, Title, SecondaryTextBlock } from 'components/atoms';
import { TextLink } from 'components/molecules';

const SidebarCollection = ({
	t,
	title,
	items,
	userID,
	bookmarks,
	noViewMore = false,
}) => (
	<Container
		style={{
			padding: 15,
			width: '100%',
			paddingBottom: 0,
			boxSizing: 'border-box',
			borderBottom: '1px solid transparent',
		}}
		className="sidebar-collection-card"
	>
		<Container style={{ color: 'rgba(0, 0, 0, .87)' }} className="meta-info">
			<Container className="sidebar-title">
				<Title className="title" style={{ paddingBottom: 0 }}>{ title }</Title>
			</Container>
			{ !noViewMore && items.length > 0 &&
				<TextLink to={bookmarks ? 'learn/bookmarks' : `/learn/more/author/${userID}`} >
					{t('common.loadMore')}
				</TextLink>
			}
		</Container>
		{
			items.length === 0
				?	<SecondaryTextBlock style={{ padding: '15px 0' }} className="flex-centered">{t('common.empty-list-message')}</SecondaryTextBlock>
				: items.map(lessonItem => (
					<CourseCard
						minimal
						{...lessonItem}
						wrapperStyle={{ padding: 0 }}
						className="collection-card-chip"
						style={{ padding: 0, boxShadow: 'none' }}
						key={`${lessonItem.name}-${lessonItem.id}`}
					/>
				))
		}
	</Container>
);

export default translate()(SidebarCollection);
