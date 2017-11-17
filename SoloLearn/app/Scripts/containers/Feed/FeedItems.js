// React modules
import React from 'react';

// Additional data and components
import FeedItem from './FeedItem';

// Utils and Defaults
import types from '../../defaults/appTypes';

const FeedItems = (props) => {
	const renderFeedItems = props.feedItems.map(feedItem => (
		<FeedItem
			key={feedItem.type === types.mergedChallange ?
				`feedGroup${feedItem.toId}` :
				`feedItem${feedItem.id}`}
			feedItem={feedItem}
			openPopup={props.openPopup}
		/>
	));
	return (
		<div id="feed-items">
			{renderFeedItems}
		</div>
	);
};

export default FeedItems;
