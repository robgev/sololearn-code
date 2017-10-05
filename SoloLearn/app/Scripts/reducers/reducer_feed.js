import { GET_FEED_ITEMS, GET_NEW_FEED_ITEMS, CLEAR_FEED } from '../constants/ActionTypes';

export default function(state = [], action) {
    switch (action.type) {
        case GET_FEED_ITEMS:
            //console.log(action.payload);
            return [ ...state, ...action.payload ];
        case GET_NEW_FEED_ITEMS:
            return [ ...action.payload, ...state ];
        case CLEAR_FEED:
            console.log('feed cleared')
            return [];
        default:
            return state;
    }
}