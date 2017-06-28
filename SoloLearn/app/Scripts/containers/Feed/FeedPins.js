//React modules
import React, { Component } from 'react';

//Additional data and components
import FeedPin from './FeedPin';

const styles = {
}

class FeedPins extends Component {
    constructor(props) {
        super(props);
    }

    renderPins() {
        return this.props.pins.map((pin, index) => {
            return (
                <FeedPin key={"pin" + pin.id} pin={pin} openPopup={this.props.openPopup} />
            );
        });
    }

    render() {
        return (
            <div className="feed-pins">
                {this.renderPins()}
            </div>
        );
    }
}

export default FeedPins;