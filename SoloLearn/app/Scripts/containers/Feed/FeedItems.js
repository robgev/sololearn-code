//React modules
import React, { Component } from 'react';

//Additional data and components
import FeedItem from './FeedItem';

//Utils and Defaults
import types from '../../defaults/appTypes';


class FeedItems extends Component {
    render() {
        const renderFeedItems = this.props.feedItems.map(feedItem => {
            return (
                <FeedItem
                    key={feedItem.type == types.mergedChallange ? "feedGroup" + feedItem.toId : "feedItem" + feedItem.id}
                    feedItem={feedItem}
                    openPopup={this.props.openPopup}
                />
            );
        });
        return (
            <div id="feed-items">
                {renderFeedItems}
            </div>
        );
    }
}

export default FeedItems;