import {
	LOGOUT,
	SET_LEADERBOARD,
	EMPTY_LEADERBOARDS,
	SET_LEADERBOARD_FILTERS,
	APPEND_LEADERBOARD_USERS,
} from 'constants/ActionTypes';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import uniqBy from 'lodash/differenceBy';

const entities = (state = [], action) => {
	switch (action.type) {
	case SET_LEADERBOARD:
		return action.payload;
	case APPEND_LEADERBOARD_USERS:
		return uniqBy([ ...state, ...action.payload ], 'id');
	case EMPTY_LEADERBOARDS:
	case LOGOUT:
		return [];
	default:
		return state;
	}
};

export const DEFAULT_FILTERS = { mode: 1, range: 1 };

const filters = (state = DEFAULT_FILTERS, action) => {
	switch (action.type) {
	case SET_LEADERBOARD_FILTERS:
		return action.payload;
	case LOGOUT:
		return DEFAULT_FILTERS;
	default:
		return state;
	}
};

const leaderboardMainSelector = state => state.leaderboards;

export const leaderboardsDataSelector = createSelector(
	leaderboardMainSelector,
	leaderboards => leaderboards.entities,
);

export const leaderboardsFiltersSelector = createSelector(
	leaderboardMainSelector,
	leaderboards => leaderboards.filters,
);

export default combineReducers({
	entities,
	filters,
});
