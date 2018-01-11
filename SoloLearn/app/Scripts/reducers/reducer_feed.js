import {
	CLEAR_FEED,
	GET_FEED_ITEMS,
	GET_NEW_FEED_ITEMS,
	SET_FEED_ITEM_VOTE_DATA,
} from '../constants/ActionTypes';

const changeFeedItemVote = (feedItems, { votes, vote, id }) => {
	const targetItemIndex = feedItems.findIndex(currentItem => currentItem.id === id);
	console.log(votes, vote, id);
	const targetItem = feedItems[targetItemIndex];
	return [
		...feedItems.slice(0, targetItemIndex),
		{ ...targetItem, vote, votes },
		...feedItems.slice(targetItemIndex + 1),
	];
};

export default function (state = [], action) {
	switch (action.type) {
	case GET_FEED_ITEMS:
		// console.log(action.payload);
		return [ ...state, ...action.payload ];
	case SET_FEED_ITEM_VOTE_DATA:
		return changeFeedItemVote(state, action.payload);
	case GET_NEW_FEED_ITEMS:
		return [ ...action.payload, ...state ];
	case CLEAR_FEED:
		return [];
	default:
		return state;
	}
}
