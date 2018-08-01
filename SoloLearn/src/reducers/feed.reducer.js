import {
	CLEAR_FEED,
	GET_FEED_ITEMS,
	RESET_LOCALE_DATA,
	GET_NEW_FEED_ITEMS,
	MARK_FEED_FINISHED,
	FOLLOW_USER_SUGGESTION,
	SET_FEED_ITEM_VOTE_DATA,
} from 'constants/ActionTypes';
import uniqBy from 'lodash/uniqBy';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const changeFeedItemVote = (feedItems, { votes, vote, id }) => {
	const targetItemIndex = feedItems.findIndex(currentItem => currentItem.id === id);
	const targetItem = feedItems[targetItemIndex];
	return [
		...feedItems.slice(0, targetItemIndex),
		{ ...targetItem, vote, votes },
		...feedItems.slice(targetItemIndex + 1),
	];
};

const entities = (state = [], action) => {
	switch (action.type) {
	case GET_FEED_ITEMS:
		// console.log(action.payload);
		return uniqBy([ ...state, ...action.payload ], 'id');
	case SET_FEED_ITEM_VOTE_DATA:
		return changeFeedItemVote(state, action.payload);
	case GET_NEW_FEED_ITEMS:
		return uniqBy([ ...action.payload, ...state ], 'id');
	case FOLLOW_USER_SUGGESTION:
		return state.map(feedItem =>
			(feedItem.id !== action.payload.feedId
				? feedItem
				: {
					...feedItem,
					suggestions: feedItem.suggestions.map(sugg =>
						(sugg.id !== action.payload.id
							? sugg
							: { ...sugg, isFollowing: action.payload.follow })),
				}
			));
	case CLEAR_FEED:
	case RESET_LOCALE_DATA:
		return [];
	default:
		return state;
	}
};

const hasMore = (state = true, action) => {
	switch (action.type) {
	case MARK_FEED_FINISHED:
		return false;
	case CLEAR_FEED:
	case RESET_LOCALE_DATA:
		return true;
	default:
		return state;
	}
};

export default combineReducers({
	entities,
	hasMore,
});

const feedRootSelector = state => state.feed;

export const feedSelector = createSelector(
	feedRootSelector,
	feed => feed.entities,
);

export const feedHasMoreSelector = createSelector(
	feedRootSelector,
	feed => feed.hasMore,
);
