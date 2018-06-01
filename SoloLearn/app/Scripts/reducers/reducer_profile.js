import {
	GET_PROFILE, GET_PROFILE_FEED_ITEMS, GET_PROFILE_NEW_FEED_ITEMS, GET_PROFILE_CODES, GET_PROFILE_QUESTIONS,
	GET_PROFILE_FOLLOWERS, GET_PROFILE_FOLLOWING, FOLLOW_USER, EMPTY_PROFILE_FOLLOWERS, EMPTY_PROFILE, CLEAR_PROFILE_FEED_ITEMS, REMOVE_CODE,
} from '../constants/ActionTypes';

const initialState = {
	data: null,
	posts: [],
	feed: [],
	codes: [],
	followers: [],
	following: [],
};

export default function (state = initialState, action) {
	switch (action.type) {
	case GET_PROFILE:
		return Object.assign({}, state, {
			data: action.payload,
		});
	case GET_PROFILE_FEED_ITEMS:
		return Object.assign({}, state, {
			feed: state.feed.concat(action.payload),
		});
	case CLEAR_PROFILE_FEED_ITEMS:
		return { ...state, feed: [] };
	case GET_PROFILE_NEW_FEED_ITEMS:
		state.feed.unshift(...action.payload);
		return state;
	case GET_PROFILE_CODES:
		return Object.assign({}, state, {
			codes: state.codes.concat(action.payload),
		});
	case REMOVE_CODE:
		return { ...state, codes: state.codes.filter(code => code.id !== action.payload) };
	case GET_PROFILE_QUESTIONS:
		return Object.assign({}, state, {
			posts: state.posts.concat(action.payload),
		});
	case GET_PROFILE_FOLLOWERS:
		return Object.assign({}, state, {
			followers: state.followers.concat(action.payload),
		});
	case GET_PROFILE_FOLLOWING:
		return Object.assign({}, state, {
			following: state.following.concat(action.payload),
		});
	case FOLLOW_USER:
		if (action.payload.fromFollowers == null) {
			return Object.assign({}, state, {
				data: { ...state.data, isFollowing: action.payload.follow },
			});
		}

		if (action.payload.fromFollowers) {
			return Object.assign({}, state, {
				followers: state.followers.map(follower => (follower.id === action.payload.id ?
					{ ...follower, isFollowing: action.payload.follow } : follower)),
			});
		}

		return Object.assign({}, state, {
			following: state.following.map(follower => (follower.id === action.payload.id ?
				{ ...follower, isFollowing: action.payload.follow } : follower)),
		});

	case EMPTY_PROFILE_FOLLOWERS:
		return Object.assign({}, state, {
			followers: [],
			following: [],
		});
	case EMPTY_PROFILE:
		return initialState;
	default:
		return state;
	}
}
