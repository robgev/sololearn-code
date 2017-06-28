//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { isLoaded } from '../../reducers';

//Additional data and components
import FeedItemsBase from './FeedItemsBase';

const styles = {
    container: {
        position: 'relative',
        //flex: '1 1 auto',
        width: '600px',
        margin: '20px auto'
    }
}

class Feed extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { feed, feedPins, isLoaded } = this.props;

        return (
            <div id="feed" style={styles.container}>
                <FeedItemsBase feed={feed} feedPins={feedPins} isUserProfile={false} isLoaded={isLoaded} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "feed"),
        feedPins: state.feedPins,
        feed: state.feed
    };
}

export default connect(mapStateToProps, () => { return {} })(Feed);