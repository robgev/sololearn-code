import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getLeaderboard = requestParams => async (dispatch) => {
	try {
		const { leaderboard } = await Service.request('GetLeaderboard', requestParams);
		dispatch({
			type: types.SET_LEADERBOARD,
			payload: leaderboard,
		});
		return leaderboard.length;
	} catch (e) {
		console.log(e);
		dispatch({
			type: types.SET_LEADERBOARD,
			payload: [],
		});
	}
};

export const loadMore = requestParams => async (dispatch) => {
	const { leaderboard } = await Service.request('GetLeaderboard', requestParams);
	dispatch({
		type: types.APPEND_LEADERBOARD_USERS,
		payload: leaderboard,
	});
	return leaderboard.length;
};
