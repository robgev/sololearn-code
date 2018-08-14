import { MAP_QUIZZES } from '../constants/ActionTypes';

export default function (state = null, action) {
	switch (action.type) {
	case MAP_QUIZZES:
		return action.payload;
	default:
		return state;
	}
}
