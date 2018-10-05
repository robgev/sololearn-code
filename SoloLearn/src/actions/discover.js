import Service from 'api/service';
import { normalize } from 'utils';
import { discoverIdsSelector } from 'reducers/discover.reducer.js';
import * as types from 'constants/ActionTypes';

export const getDiscoverSuggestions = query => async (dispatch) => {
	const response = await Service.request('Profile/SearchUsers', { query });
	if (query) {
		dispatch({
			type: types.SET_SEARCH_SUGGESTIONS,
			payload: normalize(response.users || []),
		});
	} else {
		dispatch({
			type: types.SET_DISCOVER_SUGGESTIONS,
			payload: normalize(response.users || []),
		});
	}
};

export const removeSearchSuggestions = () => (dispatch, getState) =>
	dispatch({
		type: types.REMOVE_SEARCH_SUGGESTIONS,
		payload: discoverIdsSelector(getState()),
	});

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
