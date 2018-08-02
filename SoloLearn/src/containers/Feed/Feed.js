// General modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
	getFeedItemsInternal,
	getNewFeedItemsInternal,
	getUserSuggestionsInternal,
	getPinnedFeedItemsInternal,
} from 'actions/feed';
import { feedSelector, feedHasMoreSelector } from 'reducers/feed.reducer';

import Layout from 'components/Layouts/GeneralLayout';

import 'styles/Feed/Feed.scss';
import { showError } from 'utils';
import Header from './Header';
import FeedList from './FeedList';

const mapStateToProps = state => ({
	feed: feedSelector(state),
	hasMore: feedHasMoreSelector(state),
	feedPins: state.feedPins,
	userProfile: state.userProfile,
	levels: state.levels,
});

const mapDispatchToProps = {
	getFeedItems: getFeedItemsInternal,
	getPinnedFeedItems: getPinnedFeedItemsInternal,
	getUserSuggestions: getUserSuggestionsInternal,
	getNewFeedItems: getNewFeedItemsInternal,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class FeedItemsBase extends Component {
	state = {
		hasNewItems: false,
	};

	componentWillMount() {
		const { isLoaded } = this.props;
		document.title = 'Sololearn | Feed';
		ReactGA.ga('send', 'screenView', { screenName: 'Feed Page' });
		if (!isLoaded) {
			this.props.getPinnedFeedItems(null, null, null)
				.catch(e => showError(e, 'Something went wrong when trying to fetch pins'));
			this.props.getUserSuggestions()
				.catch(e => showError(e, 'Something went wrong when trying to fetch user suggestions'));
		}
	}

	// Check availability of new items above
	loadNewFeedItems = async () => {
		const firstItem = this.props.feed[0];
		const fromId = !firstItem.groupedItems ? firstItem.toId : firstItem.id;
		try {
			const count = await this.props.getNewFeedItems(fromId, this.props.userId);
			if (!this.state.hasNewItems && count > 0) {
				this.setState({ hasNewItems: true });
			}
		} catch (e) {
			console.log(e);
		}
	}

	getFeedItems = () => {
		this.props.getFeedItems()
			.catch(e => showError(e, 'Something went wrong when trying to get feed'));
	}

	// Scroll to top of the feed
	scrollToFeedItems = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}

	render() {
		const {
			t,
			feed,
			feedPins,
			hasMore,
			userProfile,
			levels,
		} = this.props;
		return (
			<Layout>
				<div className="feed-items-wrapper">
					<Header profile={userProfile} levels={levels} />
					<p className="sub-title">{t('feed.title')}</p>
					<FeedList
						feed={feed}
						feedPins={feedPins}
						hasMore={hasMore}
						loadMore={this.getFeedItems}
					/>
				</div>
			</Layout>
		);
	}
}
export default FeedItemsBase;
