// React modules
import React from 'react';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from '../../reducers';

// Additional data and components
import FeedItemsBase from './FeedItemsBase';

const styles = {
	container: {
		position: 'relative',
		// flex: '1 1 auto',
		width: '600px',
		margin: '20px auto',
	},
};

const Feed = ({ feed, feedPins, isLoaded }) => (
	<div id="feed" style={styles.container}>
		<FeedItemsBase feed={feed} feedPins={feedPins} isUserProfile={false} isLoaded={isLoaded} />
	</div>
);

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'feed'),
	feedPins: state.feedPins,
	feed: state.feed,
});

export default connect(mapStateToProps)(Feed);
