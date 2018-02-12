// React modules
import React from 'react';
import Layout from 'components/Layouts/GeneralLayout';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from '../../reducers';

// Additional data and components
import FeedItemsBase from './FeedItemsBase';

const Feed = ({ feed, feedPins, isLoaded }) => (
	<Layout>
		<FeedItemsBase
			feed={feed}
			isLoaded={isLoaded}
			feedPins={feedPins}
			isUserProfile={false}
		/>
	</Layout>
);

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'feed'),
	feedPins: state.feedPins,
	feed: state.feed,
});

export default connect(mapStateToProps)(Feed);
