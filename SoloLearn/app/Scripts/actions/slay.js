import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const getLessonCollections = pagingData => async (dispatch) => {
	try {
		const { collections } = await Service.request('/GetCollections', pagingData);
		dispatch({
			type: types.SET_LESSON_COLLECTIONS,
			payload: collections,
		});
	} catch (e) {
		console.log(e);
	}
};
