import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { codesSelector, codesFiltersSelector } from 'reducers/codes.reducer';

export const removeCode = id => async (dispatch) => {
	dispatch({
		type: types.REMOVE_CODE,
		payload: id,
	});
	Service.request('Playground/DeleteCode', { id });
};

export const emptyCodes = () => ({
	type: types.EMPTY_CODES,
});

export const getCodes = ({
	query = '', count = 20,
} = {}) => async (dispatch, getState) => {
	const stateBefore = getState();
	const filters = codesFiltersSelector(stateBefore);
	const { length } = codesSelector(stateBefore);
	const { codes, error } = await Service.request('Playground/GetPublicCodes', {
		index: length, query, count, orderBy: filters.orderBy, language: filters.language,
	});
	if (error) {
		throw error;
	}
	// Ignore action if filters changed
	if (filters === codesFiltersSelector(getState())) {
		dispatch({ type: types.SET_CODES, payload: codes });
		if (codes.length < count) {
			dispatch({ type: types.MARK_CODES_LIST_FINISHED });
		}
	}
};

export const changeCodesLanguageFilter = lang => ({
	type: types.CODE_LANGUAGE_FILTER_CHANGE,
	payload: lang,
});

export const changeCodesOrderByFilter = orderBy => ({
	type: types.CODE_ORDER_BY_FILTER_CHANGE,
	payload: orderBy,
});
