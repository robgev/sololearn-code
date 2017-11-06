import Service from '../api/service';
import * as types from '../constants/ActionTypes';

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

export const getCodesInternal = (index, orderBy, language, query, profileId = null, count = 20) =>
	dispatch =>
		Service.request('Playground/GetPublicCodes', {
			index, count, orderBy, language, query, profileId,
		})
			.then((res) => {
				const { codes } = res;
				profileId != null ? dispatch(getProfileCodes(codes)) : dispatch(getCodes(codes));
				return codes.length;
			})
			.catch(e => console.log(e));
