import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { leaderboardsFiltersSelector } from 'reducers/leaderboards.reducer';

export const getLeaderboard = requestParams => async (dispatch, getState) => {
	const initFilters = leaderboardsFiltersSelector(getState());
	try {
		const { leaderboard } = await Service.request('GetLeaderboard', { ...initFilters, ...requestParams });
		const filters = leaderboardsFiltersSelector(getState());
		// Proceed with action only when the filters haven't changed
		// while waiting for the response
		if (initFilters.mode === filters.mode && filters.range === initFilters.range) {
			dispatch({
				type: types.SET_LEADERBOARD,
				payload: leaderboard,
			});
			return leaderboard.length;
		}
		return 0;
	} catch (e) {
		console.log(e);
		dispatch({ type: types.EMPTY_LEADERBOARDS });
		return 0;
	}
};

export const setFilters = filters => (dispatch, getState) => {
	const oldFilters = leaderboardsFiltersSelector(getState());
	const formattedFilters = { ...filters };
	if (filters.mode) {
		formattedFilters.mode = parseInt(filters.mode, 10);
	}
	if (filters.range) {
		formattedFilters.range = parseInt(filters.range, 10);
	}
	const keys = Object.keys(formattedFilters);
	if (keys.length === 0 || keys.some(key => formattedFilters[key] !== oldFilters[key])) {
		dispatch({
			type: types.SET_LEADERBOARD_FILTERS,
			payload: formattedFilters,
		});
		dispatch({ type: types.EMPTY_LEADERBOARDS });
	}
};

export const loadMore = requestParams => async (dispatch, getState) => {
	const initFilters = leaderboardsFiltersSelector(getState());
	const { leaderboard } = await Service.request('GetLeaderboard', requestParams);
	const filters = leaderboardsFiltersSelector(getState());
	if (initFilters.mode === filters.mode && filters.range === initFilters.range) {
		dispatch({
			type: types.APPEND_LEADERBOARD_USERS,
			payload: leaderboard,
		});
	}
	return leaderboard.length;
};
