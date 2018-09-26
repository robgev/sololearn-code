import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import pick from 'lodash/pick';
import {
	REMOVE_SEARCH_SUGGESTIONS,
	SET_DISCOVER_SUGGESTIONS,
	FOLLOW_USER_SUGGESTION,
	SET_SEARCH_SUGGESTIONS,
	LOGOUT,
} from 'constants/ActionTypes';

export const getEntitiesByIds = (state, filteredIds) => {
	const { entities: discoverEntitites } = state.discoverSuggestions;
	return filteredIds.map(id => discoverEntitites[id]);
};

const searchIds = (state = [], action) => {
	switch (action.type) {
	case SET_SEARCH_SUGGESTIONS:
		return action.payload.ids;
	case LOGOUT:
	case REMOVE_SEARCH_SUGGESTIONS:
		return [];
	default:
		return state;
	}
};

const ids = (state = [], action) => {
	switch (action.type) {
	case SET_DISCOVER_SUGGESTIONS:
		return action.payload.ids;
	case LOGOUT:
		return [];
	default:
		return state;
	}
};

const entities = (state = null, action) => {
	switch (action.type) {
	case SET_DISCOVER_SUGGESTIONS:
	case SET_SEARCH_SUGGESTIONS:
		return { ...state, ...action.payload.entities };
	case REMOVE_SEARCH_SUGGESTIONS:
		// payload is an array of ids
		return pick(state, action.payload);
	case LOGOUT:
		return [];
	case FOLLOW_USER_SUGGESTION:
		return {
			...state,
			[action.payload.userId]: {
				...state[action.payload.userId],
				isFollowing: action.payload.isFollowing,
			},
		};
	default:
		return state;
	}
};

const discoverReducer = state => state.discoverSuggestions;

export const discoverSearchIdsSelector = createSelector(
	discoverReducer,
	state => state.searchIds,
);

export const discoverEntitiesSelector = createSelector(
	discoverReducer,
	state => state.entities,
);

export const discoverIdsSelector = createSelector(
	// Ids of elements that are in discover peers section
	// i.e. ones we get when query is null
	discoverReducer,
	state => state.ids,
);

export default combineReducers({
	ids,
	entities,
	searchIds,
});
