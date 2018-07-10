import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import { translate } from 'react-i18next';

import CourseCard from './CourseCard';

const SidebarCollection = ({
	t,
	title,
	items,
	userID,
	noViewMore = false,
}) => (
	<Paper
		zDepth={1}
		style={{
			padding: 15,
			width: '100%',
			marginBottom: 10,
			overflow: 'hidden',
		}}
		className="sidebar-collection-card"
	>
		<div className="meta-info">
			<p>{ title }</p>
			{ !noViewMore &&
				<Link to={`/learn/more/author/${userID}`} >
					{t('common.loadMore')}
				</Link>
			}
		</div>
		{
			items.map(lessonItem => (
				<div className="course-chip-wrapper" key={`${lessonItem.name}-${lessonItem.id}`}>
					<CourseCard
						minimal
						{...lessonItem}
						className="collection-card-chip"
					/>
				</div>
			))
		}
	</Paper>
);

export default translate()(SidebarCollection);
