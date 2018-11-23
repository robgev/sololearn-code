import {
	CLEAR_FEED,
	GET_FEED_ITEMS,
	RESET_LOCALE_DATA,
	GET_NEW_FEED_ITEMS,
	MARK_FEED_FINISHED,
	SET_FEED_ITEM_VOTE_DATA,
	VOTE_POST,
	VOTE_CODE,
	VOTE_CODE_COMMENT,
} from 'constants/ActionTypes';
import feedTypes from 'defaults/appTypes';
import uniqBy from 'lodash/uniqBy';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

const changeFeedItemVote = (feedItems, { votes, vote, id }) => {
	console.log();
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
	case CLEAR_FEED:
	case RESET_LOCALE_DATA:
		return [];
	case VOTE_POST:
		return state.map((item) => {
			if (
				(item.type === feedTypes.postedQuestion || item.type === feedTypes.postedAnswer) 
				&& item.post
				&& item.post.id === action.payload.id
			) {
				item.votes = action.payload.votes;
				item.vote = action.payload.vote;
			}
			return item;
		});
	case VOTE_CODE: 
		return state.map((item) => {
			if (
				item.type === feedTypes.postedCode
				&& item.code
				&& item.code.id === action.payload.id
			) {
				item.votes = action.payload.votes;
				item.vote = action.payload.vote;
			}
			return item;
		});	

	case VOTE_CODE_COMMENT:
		return state.map((item) => {
			if (
				(item.type === feedTypes.postedCodeComment || item.type === feedTypes.postedCodeCommentReply)
				&& item.comment
				&& item.comment.id === action.payload.id
			) {
				item.votes = action.payload.votes;
				item.vote = action.payload.vote;
			}
			return item;
		});	
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
