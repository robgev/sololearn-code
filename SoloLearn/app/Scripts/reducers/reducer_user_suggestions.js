import { GET_USER_SUGESSTIONS } from '../constants/ActionTypes';

export default function (state = [], action) {
	switch (action.type) {
	case GET_USER_SUGESSTIONS:
		const newArr = [];
		while (action.payload.length) newArr.push(action.payload.splice(0, 10));

		return newArr;
	default:
		return state;
	}
}
