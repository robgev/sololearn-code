import { GET_CODES, EMPTY_CODES, REMOVE_CODE } from '../constants/ActionTypes';

const removeCode = (codeList, targetId) => {
	const targetItemIndex = codeList.findIndex(currentItem => currentItem.id === targetId);
	return targetItemIndex >= 0 ?
		[ ...codeList.slice(0, targetItemIndex),
			...codeList.slice(targetItemIndex + 1) ]
		: codeList;
};

export default function (state = [], action) {
	switch (action.type) {
	case GET_CODES:
		return state.concat(action.payload);
	case REMOVE_CODE:
		return removeCode(state, action.payload);
	case EMPTY_CODES:
		return action.payload;
	default:
		return state;
	}
}
