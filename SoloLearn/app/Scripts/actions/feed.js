import Service from '../api/service';
import * as types from '../constants/ActionTypes';
import feedTypes from '../defaults/appTypes';

export const getFeedItems = feedItems => ({
	type: types.GET_FEED_ITEMS,
	payload: feedItems,
});

const groupFeedItems = (feedItems) => {
	const groupedFeedItems = [];
	let temp = feedItems;

	while (temp.length > 0) {
		let firstItem = temp[0];
		temp.splice(0, 1);

		if (firstItem.type !== feedTypes.completedChallange) {
			groupedFeedItems.push(firstItem);
			continue;
		}

		const mergedItems = temp.filter(item => item.type == feedTypes.completedChallange && item.contest.player.id == firstItem.contest.player.id);
		temp = temp.filter(item => !(item.type == feedTypes.completedChallange && item.contest.player.id == firstItem.contest.player.id));

		if (mergedItems.length > 0) {
			const challenegesCount = mergedItems.length + 1;
			mergedItems.unshift(firstItem);

			firstItem = {
				id: mergedItems[mergedItems.length - 1].id,
				toId: firstItem.id,
				date: firstItem.date,
				title: `has completed ${challenegesCount} challenges`,
				user: firstItem.user,
				groupedItems: mergedItems,
				type: 444,
			};
		}
		groupedFeedItems.push(firstItem);
	}

	if (feedItems.length > 0) {
		const lastItem = feedItems[feedItems.length - 1];
		const groupedLastItem = groupedFeedItems[groupedFeedItems.length - 1];
		if (lastItem.id !== groupedLastItem.id) groupedLastItem.id = lastItem.id;
	}

	return new Promise((resolve, reject) => {
		resolve(groupedFeedItems);
	});
};

export const getProfileFeedItems = feedItems => ({
	type: types.GET_PROFILE_FEED_ITEMS,
	payload: feedItems,
});

export const getFeedItemsInternal = (fromId, profileId) => (dispatch, getState) => Service.request('Profile/GetFeed', { fromId, profileId, count: 20 }).then((response) => {
	const count = response.feed.length;
	const store = getState();
	const feed = store.feed;
	const userSuggestions = store.userSuggestions;
	const suggestionsBatch = feed.filter(item => item.type == feedTypes.suggestions).length;

	return groupFeedItems(response.feed).then((response) => {
		const feedItems = response;
		const feedItemsCount = feed.length + feedItems.length;

		if (profileId != null) {
			dispatch(getProfileFeedItems(feedItems)); // Load exact profile feed items.

			return count;
		}

		if (feedItemsCount >= 20 * (1 + suggestionsBatch)) {
			if (suggestionsBatch < userSuggestions.length) {
				const suggestionsObj = {
					suggestions: userSuggestions[suggestionsBatch],
					type: feedTypes.suggestions,
					id: suggestionsBatch,
				};

				feedItems.push(suggestionsObj);
			}
		}

		dispatch(getFeedItems(feedItems));

		return count;
	}).catch((error) => {
		console.log(error);
	});
}).catch((error) => {
	console.log(error);
});

export const getNewFeedItems = feedItems => ({
	type: types.GET_NEW_FEED_ITEMS,
	payload: feedItems,
});

export const getProfileNewFeedItems = feedItems => ({
	type: types.GET_PROFILE_NEW_FEED_ITEMS,
	payload: feedItems,
});

export const getNewFeedItemsInternal = (toId, userId) => (dispatch, getState) => Service.request('Profile/GetFeed', { toId, profileId: userId, count: 20 }).then((response) => {
	if (response.feed.length > 0) {
		return groupFeedItems(response.feed).then((response) => {
			const feedItems = response;

			if (userId != null) {
				dispatch(getProfileNewFeedItems(feedItems));
			} else {
				dispatch(getNewFeedItems(feedItems));
			}

			return feedItems.length;
		}).catch((error) => {
			console.log(error);
		});
	}

	return response.feed.length; // Change
});

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
