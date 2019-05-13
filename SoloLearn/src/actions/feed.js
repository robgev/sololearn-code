import { showError, groupFeedItems, forceOpenFeed } from 'utils';
import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import feedTypes from 'defaults/appTypes';

export const getFeedItems = feedItems => ({
	type: types.GET_FEED_ITEMS,
	payload: feedItems,
});

export const getProfileFeedItems = feedItems => ({
	type: types.GET_PROFILE_FEED_ITEMS,
	payload: feedItems,
});

export const clearProfileFeedItems = () => ({ type: types.CLEAR_PROFILE_FEED_ITEMS });

export const clearFeedItems = () => ({ type: types.CLEAR_FEED });

export const getFeedItemsInternal = () => async (dispatch, getState) => {
	try {
		const requestLimitCount = 20;
		const { feed: { entities: feed }, discoverSuggestions } = getState();
		const filteredFeed = feed.filter(item => item.type !== feedTypes.suggestions);
		const suggestionsBatch = feed.length - filteredFeed.length;
		const fromId = filteredFeed.length ? filteredFeed[filteredFeed.length - 1].id : null;
		const response = await Service.request('Profile/GetFeed', { fromId, count: requestLimitCount });
		const { length } = response.feed;
		const feedItems = groupFeedItems(response.feed);
		const isFirstItemGrouppedChallenge = feed.length === 0 && feedItems.length && feedItems[0].type === feedTypes.mergedChallange;
		const forceOpenedFeed = isFirstItemGrouppedChallenge ? forceOpenFeed(feedItems[0]) : feedItems;
		const feedItemsCount = feed.length + feedItems.length;
		if (feed.length + length >= requestLimitCount * (1 + suggestionsBatch) && discoverSuggestions.entities &&
			suggestionsBatch * 10 < discoverSuggestions.ids.length) {
			const suggestionsObj = {
				number: suggestionsBatch,
				type: feedTypes.suggestions,
				id: suggestionsBatch,
			};
			feedItems.push(suggestionsObj);
		}
		dispatch(getFeedItems(forceOpenedFeed));
		// If after grouping challenges, we have less than the half of the elements
		// We will send another GetFeed request
		if (feedItemsCount < requestLimitCount / 2) {
			const lastItem = feedItems[feedItems.length - 1];
			if (lastItem !== undefined) {
				const startId = lastItem.type === 444 ? lastItem.toId : lastItem.id;
				dispatch(getFeedItemsInternal(startId));
			}
		}
		if (length === 0) {
			dispatch({ type: types.MARK_FEED_FINISHED });
		}
	} catch (e) {
		throw e;
	}
};

export const getNewFeedItems = feedItems => ({
	type: types.GET_NEW_FEED_ITEMS,
	payload: feedItems,
});

export const getProfileNewFeedItems = feedItems => ({
	type: types.GET_PROFILE_NEW_FEED_ITEMS,
	payload: feedItems,
});

export const getNewFeedItemsInternal = () => async (dispatch, getState) => {
	const { feed: { entities: feed } } = getState();
	const response = await Service.request('Profile/GetFeed', { toId: feed[0].id, count: 20 });
	if (response.feed.length > 0) {
		const feedItems = groupFeedItems(response.feed);
		dispatch(getNewFeedItems(feedItems));
		return feedItems.length;
	}
	return response.feed.length;
};

export const getPinnedFeedItems = feedItems => ({
	type: types.GET_FEED_PINS,
	payload: feedItems,
});

export const getPinnedFeedItemsInternal = () => dispatch =>
	Service.request('Profile/GetFeedPinnedItems').then((response) => {
		const feedPinnedItems = response.pinnedItems;
		dispatch(getPinnedFeedItems(feedPinnedItems));
	}).catch((e) => {
		throw e;
	});

export const followUserSuggestion = ({ id, isFollowing }) => {
	const endpoint = isFollowing ? 'Profile/Unfollow' : 'Profile/Follow';
	Service.request(endpoint, { id })
		.catch(e => showError(e, 'Something went wrong when trying to follow the suggested user'));
	return {
		type: types.FOLLOW_USER_SUGGESTION,
		payload: {
			userId: id,
			isFollowing: !isFollowing,
		},
	};
};

export const getUrlByType = (feedItemType) => {
	switch (feedItemType) {
	case feedTypes.postedQuestion:
	case feedTypes.postedAnswer:
		return 'Discussion/VotePost';
	case feedTypes.postedCode:
	case feedTypes.upvoteCode:
		return 'Playground/VoteCode';
	case feedTypes.postedLessonComment:
	case feedTypes.postedLessonCommentReply:
		return 'Discussion/VoteLessonComment';
	case feedTypes.postedUserLessonComment:
	case feedTypes.postedUserLessonCommentReply:
		return 'Discussion/VoteUserLessonComment';
	case feedTypes.postedCodeComment:
	case feedTypes.postedCodeCommentReply:
	case feedTypes.upvoteCodeComment:
		return 'Discussion/VoteCodeComment';
	default:
		throw new Error('Unknown feedVoteItem type');
	}
};

export const voteFeedItem = ({
	vote,
	newVote,
	targetId,
	type: voteType,
	id: feedItemId,
	votes: totalVotes,
}) => {
	const userVote = vote === newVote ? 0 : newVote;
	const votes = (totalVotes + userVote) - vote;

	return {
		type: types.SET_FEED_ITEM_VOTE_DATA,
		payload: {
			votes,
			vote: userVote,
			id: feedItemId,
		},
	};
};
