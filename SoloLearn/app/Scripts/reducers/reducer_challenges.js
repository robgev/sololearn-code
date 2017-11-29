import { combineReducers } from 'redux';
import {
	GET_CONTESTS, CLEAR_CONTESTS, CHOOSE_CHALLENGE_COURSE, GET_ALL_PLAYERS,
	EMPTY_ALL_PLAYERS, GET_CONTEST_FOLLOWERS, GET_CONTEST_FOLLOWING, GET_CONTEST,
} from '../constants/ActionTypes';

const contests = (state = null, action) => {
	switch (action.type) {
	case GET_CONTESTS:
		return action.payload;
	case CLEAR_CONTESTS:
		return { ...state, completed: [] };
	default:
		return state;
	}
};

const courseId = (state = null, action) => {
	switch (action.type) {
	case CHOOSE_CHALLENGE_COURSE:
		return action.payload;
	default:
		return state;
	}
};

const allPlayers = (state = [], action) => {
	switch (action.type) {
	case GET_ALL_PLAYERS:
		return action.payload;
	case EMPTY_ALL_PLAYERS:
		return [];
	default:
		return state;
	}
};

const followers = (state = [], action) => {
	switch (action.type) {
	case GET_CONTEST_FOLLOWERS:
		return [ ...state, ...action.payload ];
	default:
		return state;
	}
};

const following = (state = [], action) => {
	switch (action.type) {
	case GET_CONTEST_FOLLOWING:
		return [ ...state, ...action.payload ];
	default:
		return state;
	}
};

const activeContest = (state = null, action) => {
	switch (action.type) {
	case GET_CONTEST:
		return action.payload;
	default:
		return state;
	}
};

export default combineReducers({
	contests,
	courseId,
	allPlayers,
	followers,
	following,
	activeContest,
});
