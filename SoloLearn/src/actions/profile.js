import Service from 'api/service';
import Storage from 'api/storage';
import * as types from 'constants/ActionTypes';

export const setUserProfile = payload => ({ type: types.GET_USER_PROFILE, payload });

const getProfile = payload => ({ type: types.GET_PROFILE, payload });

export const clearOpenedProfile = () => getProfile(null);

export const getUserProfileSync = () => (dispatch) => {
	const profile = Storage.load('profile');
	if (profile !== null) {
		dispatch(setUserProfile(profile));
		return true;
	}
	return false;
};

export const getUserProfileAsync = () => async (dispatch) => {
	const response = await Service.request('Profile/GetProfile');
	if (!response.error) {
		Storage.save('profile', response.profile);
		dispatch(setUserProfile(response.profile));
		return true;
	}
	return false;
};

export const getProfileInternal = userId => async (dispatch) => {
	const { profile } = await Service.request('Profile/GetProfile', { id: userId });
	dispatch(getProfile(profile));
	dispatch({ type: types.TOGGLE_COURSE, payload: profile.skills });
};

export const getProfileQuestions = questions => ({
	type: types.GET_PROFILE_QUESTIONS,
	payload: questions,
});

export const setProfileHasMoreQuestions = hasMore =>
	({ type: types.SET_PROFILE_HAS_MORE_QUESTIONS, payload: hasMore });

export const getProfileQuestionsInternal = ({ index, profileId }) => async (dispatch) => {
	const settings = {
		index,
		profileId,
		query: '',
		orderBy: 7,
		count: 20,
	};
	const { posts } = await Service.request('Discussion/Search', settings);
	dispatch(getProfileQuestions(posts));
	if (posts.length === 0) {
		dispatch(setProfileHasMoreQuestions(false));
	}
};

export const emptyProfile = () => ({
	type: types.EMPTY_PROFILE,
});

export const getFollowers = (followers, fromChallenges) => {
	const type = fromChallenges ? types.GET_CONTEST_FOLLOWERS : types.GET_PROFILE_FOLLOWERS;
	return { type, payload: followers };
};

export const getFollowersInternal = (index, userId, count = 20, fromChallenges = false) =>
	async (dispatch) => {
		try {
			const { users: followers } = await Service.request('Profile/GetFollowers', { id: userId, index, count });
			dispatch(getFollowers(followers, fromChallenges));
			return followers.length;
		} catch (e) {
			console.log(e);
		}
	};

export const getFollowing = (following, fromChallenges) => {
	const type = fromChallenges ? types.GET_CONTEST_FOLLOWING : types.GET_PROFILE_FOLLOWING;
	return { type, payload: following };
};

export const getFollowingInternal = (index, userId, count = 20, fromChallenges = false) =>
	async (dispatch, getState) => {
		try {
			const { users: following } = await Service.request('Profile/GetFollowing', { id: userId, index, count });
			dispatch(getFollowing(following, fromChallenges));
			return following.length;
		} catch (e) {
			console.log(e);
		}
	};

export const followUser = (userId, fromFollowers, follow) => dispatch =>
	dispatch({
		type: types.FOLLOW_USER,
		payload: {
			id: userId,
			follow,
			fromFollowers,
		},
	});

export const followUserInternal = (userId, fromFollowers = null) =>
	(dispatch) => {
		dispatch(followUser(userId, fromFollowers, true));
		Service.request('Profile/Follow', { id: userId })
			.catch((e) => {
				dispatch(followUser(userId, fromFollowers, false));
				throw e;
			});
	};

export const unfollowUserInternal = (userId, fromFollowers = null) =>
	(dispatch) => {
		dispatch(followUser(userId, fromFollowers, false));
		Service.request('Profile/Unfollow', { id: userId })
			.catch((e) => {
				dispatch(followUser(userId, fromFollowers, true));
				throw e;
			});
	};

export const emptyProfileFollowers = () => ({
	type: types.EMPTY_PROFILE_FOLLOWERS,
});
