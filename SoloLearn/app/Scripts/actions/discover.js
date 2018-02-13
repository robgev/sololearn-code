import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getDiscoverSuggestions = () => async (dispatch) => {
	try {
        const response = await Service.request('/Profile/SearchUsers');
        if(response.error) {
            console.log(`TODO: handle the server error`);
            return;
        }
		dispatch({
			type: types.SET_DISCOVER_SUGGESTIONS,
			payload: response.users || [],
		});
	} catch (e) {
		console.log(e);
	}
};
