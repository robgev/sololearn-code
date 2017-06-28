import { GET_FEED_ITEMS, GET_NEW_FEED_ITEMS } from '../constants/ActionTypes';

export default function(state = [], action) {
    switch (action.type) {
        case GET_FEED_ITEMS:
            //console.log(action.payload);
            return state.concat(action.payload);
        case GET_NEW_FEED_ITEMS: 
            state.unshift(...action.payload);
            return state;
        default:
            return state;
    }
}