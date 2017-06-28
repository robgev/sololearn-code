import React, { Component } from 'react';

class FeedItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="feed-item">
                {this.props.name}
            </div>
        );
    }
}

export default FeedItem;