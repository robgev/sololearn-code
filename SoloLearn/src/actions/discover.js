import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getDiscoverSuggestions = query => async (dispatch) => {
	const response = await Service.request('/Profile/SearchUsers', { query });
	dispatch({
		type: types.SET_DISCOVER_SUGGESTIONS,
		payload: response.users || [],
	});
};

export const followSuggestion = ({ id, isFollowing }) => async (dispatch) => {
	const endpoint = isFollowing ? 'Profile/Unfollow' : 'Profile/Follow';
	dispatch({
		type: types.FOLLOW_USER_SUGGESTION,
		payload: {
			userId: id,
			isFollowing: !isFollowing,
		},
	});
	Service.request(endpoint, { id })
		.catch((e) => {
			dispatch({
				type: types.FOLLOW_USER_SUGGESTION,
				payload: {
					userId: id,
					isFollowing,
				},
			});
			throw e;
		});
};
