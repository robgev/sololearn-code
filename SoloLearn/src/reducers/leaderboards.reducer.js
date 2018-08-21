import {
	SET_LEADERBOARD,
	APPEND_LEADERBOARD_USERS,
} from 'constants/ActionTypes';
import differenceBy from 'lodash/differenceBy';

const safeAdd = (oldList, newList) => {
	const appendedArticles = differenceBy(newList, oldList, 'userID');
	return [ ...oldList, ...appendedArticles ];
};

const leaderboards = (state = [], action) => {
	switch (action.type) {
	case SET_LEADERBOARD:
		return action.payload;
	case APPEND_LEADERBOARD_USERS:
		return safeAdd(state, action.payload);
	default:
		return state;
	}
};

export default leaderboards;
