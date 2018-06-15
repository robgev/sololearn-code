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
}) => {
	const renderFeedItems = feedItems.map(feedItem => (
		<FeedItem
			key={feedItem.type === types.mergedChallange ?
				`feedGroup${feedItem.toId}` :
				`feedItem${feedItem.id}`}
			feedItem={feedItem}
			openPopup={openPopup}
		/>
	));
	return (
		<div style={style} className={className}>
			{renderFeedItems}
		</div>
	);
};

export default FeedItems;
