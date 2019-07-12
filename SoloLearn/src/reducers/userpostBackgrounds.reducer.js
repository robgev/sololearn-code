import {
	RESET_LOCALE_DATA,
	SET_USERPOST_BACKGROUNDS,
	RESET_USERPOST_BACKGROUNDS,
} from 'constants/ActionTypes';
import { createSelector } from 'reselect';

export default function (state = [], action) {
	switch (action.type) {
	case SET_USERPOST_BACKGROUNDS:
		return action.payload;
	case RESET_LOCALE_DATA:
	case RESET_USERPOST_BACKGROUNDS:
		return [];
	default:
		return state;
	}
}

const backgroundsReducer = state => state.userpostBackgrounds;

export const getUserpostBackgroundsSelector = createSelector(
	backgroundsReducer,
	userpostBackgrounds => userpostBackgrounds,
);
