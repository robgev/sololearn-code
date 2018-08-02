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
};

export const setNotificationCount = count => ({
	type: types.SET_NOTIFICATION_COUNT,
	payload: count,
});

export const getNotificationCountInternal = () => async (dispatch) => {
	try {
		const { count } = await Service.request('Profile/GetUnseenNotificationCount');
		dispatch(setNotificationCount(count));
	} catch (e) {
		console.log(e);
	}
};

export const emptyNotifications = () => dispatch =>
	new Promise((resolve) => {
		dispatch({ type: types.EMPTY_NOTIFICATIONS });
		resolve();
	});

export const getNotifications = notifications => ({
	type: types.GET_NOTIFICATIONS,
	payload: notifications,
});

const groupNotificationItems = (notifications) => {
	const groupedNotifications = [];
	let temp = notifications;

	while (temp.length > 0) {
		const firstItem = temp[0];
		temp.splice(0, 1);

		const groupedItems = temp.filter(item => item.groupID === firstItem.groupID);
		temp = temp.filter(item => item.groupID !== firstItem.groupID);
		firstItem.groupedItems = groupedItems;

		groupedNotifications.push(firstItem);
	}
	return groupedNotifications;
};

export const getNotificationsInternal = (fromId, toId) =>
	async (dispatch) => {
		try {
			const { notifications } = await Service.request('Profile/GetNotifications', { fromId, toId, count: 20 });
			const { length } = notifications;
			const notificationItemsResponse = groupNotificationItems(notifications);
			dispatch(getNotifications(notificationItemsResponse));
			return length;
		} catch (e) {
			console.log(e);
		}
	};

export const markAllRead = () => ({ type: types.MARK_ALL_READ });

export const markRead = ids => ({
	type: types.MARK_READ,
	payload: ids,
});

export const markReadInternal = ids => (dispatch) => {
	try {
		if (ids != null) dispatch(markRead(ids));
		else dispatch(markAllRead());
		Service.request('Profile/MarkNotificationsClicked', { ids });
	} catch (e) {
		console.log(e);
	}
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
