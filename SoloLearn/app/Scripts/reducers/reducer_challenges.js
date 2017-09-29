import {
    GET_CONTESTS, CLEAR_CONTESTS, CHOOSE_CHALLENGE_COURSE, GET_ALL_PLAYERS,
    EMPTY_ALL_PLAYERS, GET_CONTEST_FOLLOWERS, GET_CONTEST_FOLLOWING, GET_CONTEST
} from '../constants/ActionTypes';

const initialState = {
    contests: null,
    courseId: null,
    allPlayers: [],
    followers: [],
    following: [],
    activeContest: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CONTESTS:
            return Object.assign({}, state, {
                contests: action.payload
            });
        case CLEAR_CONTESTS: 
            return Object.assign({}, state, {
                contests: Object.assign({}, state.contests, {
                    completed: []
                })
            });
        case CHOOSE_CHALLENGE_COURSE:
            return Object.assign({}, state, {
                courseId: action.payload
            });
        case GET_ALL_PLAYERS: 
            return Object.assign({}, state, {
                allPlayers: action.payload
            });
        case EMPTY_ALL_PLAYERS:
            return Object.assign({}, state, {
                allPlayers: []
            });
        case GET_CONTEST_FOLLOWERS:
            return Object.assign({}, state, {
                followers: state.followers.concat(action.payload)
            });
        case GET_CONTEST_FOLLOWING:
            return Object.assign({}, state, {
                following: state.following.concat(action.payload)
            });
        case GET_CONTEST:
            return Object.assign({}, state, {
                activeContest: action.payload
            });
        default:
            return state;
    }
}