//React modules
import React, { Component } from 'react';

//Additional data and components
import FeedItem from './FeedItem';

//Utils and Defaults
import types from '../../defaults/appTypes';


class FeedItems extends Component {
    renderFeedItems = () => {
        //console.log(this.props.feedItems.filter(item => { return item.id == 29719773; }));

        return this.props.feedItems.map(feedItem => {
            return (
                <FeedItem
                    key={feedItem.type == types.mergedChallange ? "feedGroup" + feedItem.toId : "feedItem" + feedItem.id}
                    feedItem={feedItem}
                    openPopup={this.props.openPopup}
                />
            );
        });
    }

    render() {
        return (
            <div id="feed-items">
                {this.renderFeedItems()}
            </div>
        );
    }
}

export default FeedItems;