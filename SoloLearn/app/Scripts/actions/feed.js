import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import feedTypes from 'defaults/appTypes';

export const getFeedItems = feedItems => ({
	type: types.GET_FEED_ITEMS,
	payload: feedItems,
});

const groupAllChallengesByUser = (searchedFeedItems, currentItem) => {
	const allChallenges = searchedFeedItems.filter(currentlyCheckedItem =>
		currentlyCheckedItem.type === feedTypes.completedChallange &&
		currentlyCheckedItem.contest.player.id === currentItem.contest.player.id);
	if (allChallenges.length > 1) {
		const challengesCount = allChallenges.length;
		return {
			id: allChallenges[challengesCount - 1].id,
			toId: currentItem.id,
			date: currentItem.date,
			title: `has completed ${challengesCount} challenges`,
			user: currentItem.user,
			groupedItems: allChallenges,
			type: 444,
		};
	}
	return currentItem;
};

const groupFeedItems = (feedItems) => {
	const reducedItems =
		feedItems.reduce(({ groupedItems, checkedChallengers }, feedItem, currentIndex) => {
			if (feedItem.type !== feedTypes.completedChallange) {
				const newGroup = [ ...groupedItems, feedItem ];
				return {
					checkedChallengers,
					groupedItems: newGroup,
				};
			}
			const playerID = feedItem.contest.player.id;
			const isUserChallengesAlreadyGrouped = checkedChallengers.includes(playerID);
			if (!isUserChallengesAlreadyGrouped) {
				const searchArray = feedItems.slice(currentIndex);
				const allChallengesByCurrentChallenger =
					groupAllChallengesByUser(searchArray, feedItem);
				const newCheckedChallengersList = [ ...checkedChallengers, playerID ];
				const newGroup = [ ...groupedItems, allChallengesByCurrentChallenger ];
				return {
					groupedItems: newGroup,
					checkedChallengers: newCheckedChallengersList,
				};
			}

			return {
				groupedItems,
				checkedChallengers,
			};
		}, { groupedItems: [], checkedChallengers: [] });

	return reducedItems.groupedItems;
};

export const getProfileFeedItems = feedItems => ({
	type: types.GET_PROFILE_FEED_ITEMS,
	payload: feedItems,
});

export const clearProfileFeedItems = () => ({ type: types.CLEAR_PROFILE_FEED_ITEMS });

export const getFeedItemsInternal = (fromId, profileId) => async (dispatch, getState) => {
	try {
		const requestLimitCount = 20;
		const response = await Service.request('Profile/GetFeed', { fromId, profileId, count: requestLimitCount });
		const { length } = response.feed;
		const { feed, userSuggestions } = getState();
		const suggestionsBatch = feed.filter(item => item.type === feedTypes.suggestions).length;
		const feedItems = groupFeedItems(response.feed);
		const feedItemsCount = feed.length + feedItems.length;
		if (profileId != null) {
			dispatch(getProfileFeedItems(feedItems));
			if (feedItemsCount < requestLimitCount / 2) {
				const lastItem = feedItems[feedItems.length - 1];
				const startId = lastItem.type === 444 ? lastItem.toId : lastItem.id;
				await dispatch(getFeedItemsInternal(startId, profileId));
			}
			return length;
		} else if (feedItemsCount >= requestLimitCount * (1 + suggestionsBatch) &&
			suggestionsBatch < userSuggestions.length) {
			const suggestionsObj = {
				suggestions: userSuggestions[suggestionsBatch],
				type: feedTypes.suggestions,
				id: suggestionsBatch,
			};
			feedItems.push(suggestionsObj);
		}
		dispatch(getFeedItems(feedItems));
		// If after grouping challenges, we have less than the half of the elements
		// We will send another GetFeed request
		if (feedItemsCount < requestLimitCount / 2) {
			console.log('Here');
			const lastItem = feedItems[feedItems.length - 1];
			const startId = lastItem.type === 444 ? lastItem.toId : lastItem.id;
			dispatch(getFeedItemsInternal(startId, profileId));
		}
		return length;
	} catch (e) {
		return console.log(e);
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
	type: types.GET_USER_SUGESSTIONS,
	payload: users,
});

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
	await Service.request('Discussion/VotePost', { id: postId, vote: userVote });
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
	await Service.request('Playground/VoteCode', { id: codeId, vote: userVote });
};
