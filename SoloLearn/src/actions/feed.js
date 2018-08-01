import { toast } from 'react-toastify';
import { showError, groupFeedItems } from 'utils';
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

export const getFeedItemsInternal = () => async (dispatch, getState) => {
	try {
		const requestLimitCount = 20;
		const { feed: { entities: feed }, userSuggestions } = getState();
		const filteredFeed = feed.filter(item => item.type !== feedTypes.suggestions);
		const suggestionsBatch = feed.length - filteredFeed.length;
		const fromId = filteredFeed.length ? filteredFeed[filteredFeed.length - 1].id : null;
		const response = await Service.request('Profile/GetFeed', { fromId, count: requestLimitCount });
		const { length } = response.feed;
		const feedItems = groupFeedItems(response.feed);
		const feedItemsCount = feed.length + feedItems.length;
		if (feed.length + length >= requestLimitCount * (1 + suggestionsBatch) &&
			suggestionsBatch * 10 < userSuggestions.length) {
			const suggestionsObj = {
				suggestions: userSuggestions.slice(suggestionsBatch * 10, (suggestionsBatch * 10) + 10),
				type: feedTypes.suggestions,
				id: suggestionsBatch,
			};
			feedItems.push(suggestionsObj);
		}
		dispatch(getFeedItems(feedItems));
		// If after grouping challenges, we have less than the half of the elements
		// We will send another GetFeed request
		if (feedItemsCount < requestLimitCount / 2) {
			const lastItem = feedItems[feedItems.length - 1];
			if (lastItem !== undefined) {
				const startId = lastItem.type === 444 ? lastItem.toId : lastItem.id;
				dispatch(getFeedItemsInternal(startId, profileId));
			}
		}
		if (length < requestLimitCount) {
			dispatch({ type: types.MARK_FEED_FINISHED });
		}
	} catch (e) {
		console.log(e);
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

export const getNewFeedItemsInternal = (toId, userId) => async (dispatch) => {
	const response = await Service.request('Profile/GetFeed', { toId, profileId: userId, count: 20 });
	if (response.feed.length > 0) {
		const feedItems = groupFeedItems(response.feed);
		if (userId != null) {
			dispatch(getProfileNewFeedItems(feedItems));
		} else {
			dispatch(getNewFeedItems(feedItems));
		}
		return feedItems.length;
	}
	return response.feed.length; // Change
};

export const getPinnedFeedItems = feedItems => ({
	type: types.GET_FEED_PINS,
	payload: feedItems,
});

export const getPinnedFeedItemsInternal = () => (dispatch) => {
	Service.request('Profile/GetFeedPinnedItems').then((response) => {
		const feedPinnedItems = response.pinnedItems;
		dispatch(getPinnedFeedItems(feedPinnedItems));
	}).catch((error) => {
		console.log(error);
	});
};

export const getUserSuggestions = users => ({
	type: types.GET_USER_SUGGESTIONS,
	payload: users,
});

export const followUserSuggestion = ({ id, feedId, follow }) => {
	try {
		const endpoint = follow ? 'Profile/Follow' : 'Profile/Unfollow';
		const res = Service.request(endpoint, { id });
		if (res && res.error) {
			showError(res.error.data);
		}
		return {
			type: types.FOLLOW_USER_SUGGESTION,
			payload: {
				id,
				follow,
				feedId,
			},
		};
	} catch (e) {
		toast.error(`❌Something went wrong when trying to ${follow ? 'unfollow' : 'follow'}: ${e.message}`);
	}
};

export const getUserSuggestionsInternal = () => dispatch => Service.request('Profile/SearchUsers').then((response) => {
	dispatch(getUserSuggestions(response.users));
}).catch((error) => {
	console.log(error);
});

export const voteFeedPostItem = ({
	vote,
	id: feedItemId,
	votes: totalVotes,
	post: { id: postId },
}, newVote) => async (dispatch) => {
	const userVote = vote === newVote ? 0 : newVote;
	const votes = (totalVotes + userVote) - vote;
	dispatch({
		type: types.SET_FEED_ITEM_VOTE_DATA,
		payload: {
			votes,
			vote: userVote,
			id: feedItemId,
		},
	});
	try {
		const res = await Service.request('Discussion/VotePost', { id: postId, vote: userVote });
		if (res && res.error) {
			showError(res.error.data);
		}
	} catch (e) {
		toast.error(`❌Something went wrong when trying to vote: ${e.message}`);
	}
};

export const voteFeedCommentItem = ({
	vote,
	id: feedItemId,
	votes: totalVotes,
	comment: { id: commentId },
}, newVote, commentsType) => async (dispatch) => {
	const userVote = vote === newVote ? 0 : newVote;
	const votes = (totalVotes + userVote) - vote;
	const url =
		commentsType === 'lesson'
			? 'Discussion/VoteLessonComment'
			: 'Discussion/VoteCodeComment';
	dispatch({
		type: types.SET_FEED_ITEM_VOTE_DATA,
		payload: {
			votes,
			vote: userVote,
			id: feedItemId,
		},
	});
	await Service.request(url, { id: commentId, vote: userVote });
};

export const voteFeedCodeItem = ({
	vote,
	id: feedItemId,
	votes: totalVotes,
	code: { id: codeId },
}, newVote) => async (dispatch) => {
	const userVote = vote === newVote ? 0 : newVote;
	const votes = (totalVotes + userVote) - vote;
	dispatch({
		type: types.SET_FEED_ITEM_VOTE_DATA,
		payload: {
			votes,
			vote: userVote,
			id: feedItemId,
		},
	});
	try {
		const res = await Service.request('Playground/VoteCode', { id: codeId, vote: userVote });
		if (res && res.error) {
			showError(res.error.data);
		}
	} catch (e) {
		toast.error(`❌Something went wrong when trying to vote: ${e.message}`);
	}
};
