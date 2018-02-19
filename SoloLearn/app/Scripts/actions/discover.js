import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getDiscoverSuggestions = query => async (dispatch) => {
	try {
		const response = await Service.request('/Profile/SearchUsers', { query });
		dispatch({
			type: types.SET_DISCOVER_SUGGESTIONS,
			payload: response.users || [],
		});
	} catch (e) {
		console.log(e);
	}
};
