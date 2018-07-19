// React modules
import React from 'react';

// Additional data and components
import FeedItem from './FeedItem';

// Utils and Defaults
import types from '../../defaults/appTypes';

const FeedItems = ({
	style,
	feedItems,
	openPopup,
	className,
}) => (
	<div id="feed-items" style={style} className={className}>
		{feedItems.map(feedItem => (
			<FeedItem
				key={feedItem.type === types.mergedChallange ?
					`feedGroup${feedItem.toId}` :
					`feedItem${feedItem.id}`}
				feedItem={feedItem}
				openPopup={openPopup}
			/>
		))}
	</div>
);

export default FeedItems;
