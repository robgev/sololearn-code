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
import { Container, FlexBox, Title } from 'components/atoms';
import { showError } from 'utils';
import Storage from 'api/storage';
import FeedHeader from './FeedHeader';
import FeedList from './FeedList';
import FeedSidebar from './FeedSidebar';

import './styles.scss';

const mapStateToProps = state => ({
	feed: feedSelector(state),
	hasMore: feedHasMoreSelector(state),
	feedPins: state.feedPins,
	userProfile: state.userProfile && state.userProfile,
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
			currentFilter: !this.props.userProfile ? 1 : currentFilter,
		};
	}

	componentDidMount() {
		const { isLoaded, userProfile } = this.props;
		document.title = 'Sololearn | Feed';
		ReactGA.ga('send', 'screenView', { screenName: 'Feed Page' });
		if (!isLoaded) {
			this.getFeedItems();

			if (userProfile) {
				this.props.getPinnedFeedItems(null, null, null)
					.catch(e => showError(e, 'Something went wrong when trying to fetch pins'));
			}

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

	handleFeedFilterChange = currentFilter => () => {
		const {
			clearFeedItems,
			getPinnedFeedItems,
		} = this.props;
		this.setState({ currentFilter }, () => {
			clearFeedItems();
			this.getFeedItems();
			if (currentFilter === 0) {
				getPinnedFeedItems(null, null, null);
			}
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
				paper={false}
				sidebar={<FeedSidebar />}
			>
				<Container className="feed-items-wrapper">
					{
						userProfile &&
						<FeedHeader
							profile={userProfile}
							levels={levels}
							afterPostCallback={this.loadNewFeedItems}
						/>
					}
					<FlexBox align className="feed-filters">
						{
							userProfile &&
							<Title
								value={0}
								className={`sub-title ${currentFilter === 0 ? 'active' : ''}`}
								onClick={this.handleFeedFilterChange(0)}
							>
								{t('feed.title')}
							</Title>
						}
						<Title
							value={1}
							className={`sub-title ${currentFilter === 1 ? 'active' : ''}`}
							onClick={this.handleFeedFilterChange(1)}
						>
							{t('feed.weekly-title')}
						</Title>
					</FlexBox>
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
