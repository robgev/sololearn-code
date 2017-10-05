import {
    GET_CONTESTS, CLEAR_CONTESTS, CHOOSE_CHALLENGE_COURSE, GET_ALL_PLAYERS,
    EMPTY_ALL_PLAYERS, GET_CONTEST_FOLLOWERS, GET_CONTEST_FOLLOWING, GET_CONTEST
} from '../constants/ActionTypes';
import { combineReducers } from 'redux';

// const initialState = {
//     contests: null,
//     courseId: null,
//     allPlayers: [],
//     followers: [],
//     following: [],
//     activeContest: null
// }

const contests = (state = null, action) => {
    switch(action.type) {
        case GET_CONTESTS:
            return action.payload;
        case CLEAR_CONTESTS:
            return { ...state, completed: [] };
        default:
            return state;
    }
}

const courseId = (state = null, action) => {
    switch(action.type) {
        case CHOOSE_CHALLENGE_COURSE:
            return action.payload;
        default:
            return state;
    }
}

const allPlayers = (state = [], action) => {
    switch(action.type) {
        case GET_ALL_PLAYERS:
            return action.payload;
        case EMPTY_ALL_PLAYERS:
            return [];
        default:
            return state;
    }
}

const followers = (state = [], action) => {
    switch(action.type) {
        case GET_CONTEST_FOLLOWERS:
            return [ ...state, ...action.payload ];
        default:
            return state;
    }
}

const following = (state = [], action) => {
    switch(action.type) {
        case GET_CONTEST_FOLLOWING:
            return [ ...state, ...action.payload ];
        default:
            return state;
    }
}

const activeContest = (state = null, action) => {
    switch(action.type) {
        case GET_CONTEST:
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    contests, courseId, allPlayers,
    followers, following, activeContest
})

// export default function (state = initialState, action) {
//     switch (action.type) {
//         case GET_CONTESTS:
//             return { ...state, contests: action.payload };
//             // Object.assign({}, state, {
//             //     contests: action.payload
//             // });
//         case CLEAR_CONTESTS: 
//             return { ...state, contests: { ...state.contests, completed: [] } }; 
//             // Object.assign({}, state, {
//             //     contests: Object.assign({}, state.contests, {
//             //         completed: []
//             //     })
//             // });
//         case CHOOSE_CHALLENGE_COURSE:
//             return { ...state, courseId: action.payload };
//             // Object.assign({}, state, {
//             //     courseId: action.payload
//             // });
//         case GET_ALL_PLAYERS: 
//             return { ...state, allPlayers: action.payload };
//             // Object.assign({}, state, {
//             //     allPlayers: action.payload
//             // });
//         case EMPTY_ALL_PLAYERS:
//             return { ...state, allPlayers: [] };
//             // Object.assign({}, state, {
//             //     allPlayers: []
//             // });
//         case GET_CONTEST_FOLLOWERS:
//             return { ...state, followers: [ ...state.followers, ...action.payload ] };
//             // Object.assign({}, state, {
//             //     followers: state.followers.concat(action.payload)
//             // });
//         case GET_CONTEST_FOLLOWING:
//             return { ...state, following: [ ...state.following, ...action.payload ] };
//             // Object.assign({}, state, {
//             //     following: state.following.concat(action.payload)
//             // });
//         case GET_CONTEST:
//             return { ...state, activeContest: action.payload };
//             // Object.assign({}, state, {
//             //     activeContest: action.payload
//             // });
//         default:
//             return state;
//     }
// }