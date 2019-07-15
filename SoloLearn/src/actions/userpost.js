import Service from 'api/service';
import {
	SET_USERPOST_BACKGROUNDS,
} from 'constants/ActionTypes';

export const getUserpostBackgrounds = () => async (dispatch) => {
	const { backgrounds } = await Service.request('Profile/GetPostBackgrounds');
	backgrounds.push({ type: 'none', id: -1 });
	dispatch({
		type:	SET_USERPOST_BACKGROUNDS,
		payload: backgrounds,
	});
};
