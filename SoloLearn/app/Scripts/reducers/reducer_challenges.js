import { GET_CONTESTS, CLEAR_CONTESTS } from '../constants/ActionTypes';

const initialState = {
    contests: null
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
        default:
            return state;
    }
}