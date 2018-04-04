import Service from 'api/service';
import * as types from 'constants/ActionTypes';

export const emptyCodes = () =>
	dispatch =>
		new Promise((resolve) => {
			dispatch({
				type: types.EMPTY_CODES,
				payload: [],
			});
			resolve();
		});

const getCodes = payload => ({
	type: types.GET_CODES,
	payload,
});

const getProfileCodes = codes => ({
	type: types.GET_PROFILE_CODES,
	payload: codes,
});

export const removeCode = id => async (dispatch) => {
	await Service.request('Playground/DeleteCode', { id });
	dispatch({
		type: types.REMOVE_CODE,
		payload: id,
	});
};

export const getCodesInternal = (index, orderBy, language, query, profileId = null, count = 20) =>
	async (dispatch) => {
		const { codes } = await Service.request('Playground/GetPublicCodes', {
			index, count, orderBy, language, query, profileId,
		});
		if (profileId != null) {
			dispatch(getProfileCodes(codes));
		} else {
			dispatch(getCodes(codes));
		}
		return codes.length;
	};
