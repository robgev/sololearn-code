// General modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
	voteFeedItem,
	clearFeedItems,
	getNewFeedItems,
	getFeedItemsInternal,
	getPinnedFeedItemsInternal,
} from 'actions/feed';
import {
	getDiscoverSuggestions,
} from 'actions/discover';
import { feedSelector, feedHasMoreSelector } from 'reducers/feed.reducer';
import { LayoutWithSidebar } from 'components/molecules';
import { Container, Select, MenuItem, Title } from 'components/atoms';
import { showError } from 'utils';
import Storage from 'api/storage';
import FeedHeader from './FeedHeader';
import FeedList from './FeedList';
import FeedSidebar from './FeedSidebar';

import 'styles/Feed/Feed.scss';

const mapStateToProps = state => ({
	feed: feedSelector(state),
	hasMore: feedHasMoreSelector(state),
	feedPins: state.feedPins,
	userProfile: state.userProfile,
	levels: state.levels,
});

const mapDispatchToProps = {
	voteFeedItem,
	clearFeedItems,
	getFeedItems: getFeedItemsInternal,
	getPinnedFeedItems: getPinnedFeedItemsInternal,
	getDiscoverSuggestions,
	getNewFeedItems,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class FeedItemsBase extends Component {
	constructor(props) {
		super(props);
		const currentFilter = Storage.load('currentFilter') || 0;
		this.state = {
			hasNewItems: false,
			loading: false,
			currentFilter,
		};
	}

	componentDidMount() {
		const { isLoaded } = this.props;
		document.title = 'Sololearn | Feed';
		ReactGA.ga('send', 'screenView', { screenName: 'Feed Page' });
		if (!isLoaded) {
			this.getFeedItems();
			this.props.getPinnedFeedItems(null, null, null)
				.catch(e => showError(e, 'Something went wrong when trying to fetch pins'));
			this.props.getDiscoverSuggestions()
				.catch(e => showError(e, 'Something went wrong when trying to fetch user suggestions'));
		}
	}

	// Check availability of new items above
	loadNewFeedItems = (feedItem) => {
		this.props.getNewFeedItems([ feedItem ]);
		this.setState({ hasNewItems: true });
	}

	resetNewFlag = () => {
		this.setState({ hasNewItems: false });
	}

	getFeedItems = () => {
		const isHighlights = this.state.currentFilter === 1;
		this.setState({ loading: true });
		this.props.getFeedItems(isHighlights)
			.then(() => { this.setState({ loading: false }); })
			.catch(e => showError(e, 'Something went wrong when trying to get feed'));
	}

	handleFeedFilterChange = (e) => {
		const {
			clearFeedItems,
			getPinnedFeedItems,
		} = this.props;
		const { value: currentFilter } = e.target;
		this.setState({ currentFilter }, () => {
			clearFeedItems();
			this.getFeedItems();
			getPinnedFeedItems(null, null, null);
			Storage.save('currentFilter', currentFilter);
		});
	}

	// Scroll to top of the feed
	scrollToFeedItems = () => {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
	}

	// Should not show feed pins when
	// filter is on weekly highlights
	render() {
		const {
			t,
			feed,
			feedPins,
			hasMore,
			userProfile,
			levels,
			voteFeedItem,
		} = this.props;
		const { loading, currentFilter, hasNewItems } = this.state;
		return (
			<LayoutWithSidebar
				sidebar={<FeedSidebar t={t} />}
			>
				<Container className="feed-items-wrapper">
					<FeedHeader
						profile={userProfile}
						levels={levels}
						afterPostCallback={this.loadNewFeedItems}
					/>
					<Select
						value={currentFilter}
						className="feed-items_select"
						onChange={this.handleFeedFilterChange}
					>
						<MenuItem value={0}>
							<Title className="sub-title">
								{t('feed.title')}
							</Title>
						</MenuItem>
						<MenuItem value={1}>
							<Title className="sub-title">
								{t('feed.weekly-title')}
							</Title>
						</MenuItem>
					</Select>
					<FeedList
						feed={feed}
						feedPins={feedPins}
						hasMore={hasMore}
						loading={loading}
						hasNewItems={hasNewItems}
						loadMore={this.getFeedItems}
						voteFeedItem={voteFeedItem}
						showPins={currentFilter !== 1}
						resetNewFlag={this.resetNewFlag}
					/>
				</Container>
			</LayoutWithSidebar>
		);
	}
}
export default FeedItemsBase;
