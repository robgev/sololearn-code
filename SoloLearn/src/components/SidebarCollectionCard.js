import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';

import CourseCard from './CourseCard';

const SidebarCollection = ({
	t,
	title,
	items,
	userID,
	bookmarks,
	noViewMore = false,
}) => (
	<div
		style={{
			padding: 15,
			width: '100%',
			paddingBottom: 0,
			boxSizing: 'border-box',
		}}
		className="sidebar-collection-card"
	>
		<div style={{ color: 'rgba(0, 0, 0, .87)' }} className="meta-info">
			<p>{ title }</p>
			{ !noViewMore &&
				<Link to={bookmarks ? 'learn/bookmarks' : `/learn/more/author/${userID}`} >
					{t('common.loadMore')}
				</Link>
			}
		</div>
		{
			items.map(lessonItem => (
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
	</div>
);

export default translate()(SidebarCollection);
