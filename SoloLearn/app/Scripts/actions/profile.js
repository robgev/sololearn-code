import Service from 'api/service';
import * as types from 'constants/ActionTypes';
import { changeLoginModal } from './login.action';

export const getNotificationCount = count => ({
	type: types.GET_NOTIFICATIONS_COUNT,
	payload: count,
});

export const getNotificationCountInternal = () => (dispatch, getState) => {
	if (!getState().imitLoggedin) return;
	Service.request('Profile/GetUnseenNotificationCount')
		.then((response) => {
			dispatch(getNotificationCount(response.count));
		})
		.catch((error) => {
			console.log(error);
		});
};

export const emptyNotifications = () => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.EMPTY_NOTIFICATIONS,
			payload: [],
		});
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

	return new Promise((resolve) => {
		resolve(groupedNotifications);
	});
};

export const getNotificationsInternal = (fromId, toId) =>
	async (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		try {
			const { notifications } = await Service.request('Profile/GetNotifications', { fromId, toId, count: 20 });
			const { length } = notifications;
			const notificationItemsResponse = await groupNotificationItems(notifications);
			dispatch(getNotifications(notificationItemsResponse));
			return length;
		} catch (e) {
			console.log(e);
		}
	};

export const markAllRead = () => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.MARK_ALL_READ,
		});
		resolve();
	});

export const markRead = ids => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.MARK_READ,
			payload: ids,
		});
		resolve();
	});

export const markReadInternal = ids => async (dispatch) => {
	const dispatchPromise = ids != null ? dispatch(markRead(ids)) : dispatch(markAllRead());
	try {
		await dispatchPromise;
		Service.request('Profile/MarkNotificationsClicked', { ids });
	} catch (e) {
		console.log(e);
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
	async (dispatch, getState) => {
		if (getState().imitLoggedin) {
			try {
				const { users: followers } = await Service.request('Profile/GetFollowers', { id: userId, index, count });
				dispatch(getFollowers(followers, fromChallenges));
				return followers.length;
			} catch (e) {
				console.log(e);
			}
		}
	};

export const getFollowing = (following, fromChallenges) => {
	const type = fromChallenges ? types.GET_CONTEST_FOLLOWING : types.GET_PROFILE_FOLLOWING;
	return { type, payload: following };
};

export const getFollowingInternal = (index, userId, count = 20, fromChallenges = false) =>
	async (dispatch, getState) => {
		if (getState().imitLoggedin) {
			try {
				const { users: following } = await Service.request('Profile/GetFollowing', { id: userId, index, count });
				dispatch(getFollowing(following, fromChallenges));
				return following.length;
			} catch (e) {
				console.log(e);
			}
		}
	};

export const followUser = (userId, fromFollowers, follow) => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.FOLLOW_USER,
			payload: {
				id: userId,
				follow,
				fromFollowers,
			},
		});
		resolve();
	});

export const followUserInternal = (userId, fromFollowers) =>
	async (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		try {
			await dispatch(followUser(userId, fromFollowers, true));
			return Service.request('Profile/Follow', { id: userId });
		} catch (e) {
			console.log(e);
		}
	};

export const unfollowUserInternal = (userId, fromFollowers) =>
	async (dispatch, getState) => {
		if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
		try {
			await dispatch(followUser(userId, fromFollowers, false));
			return Service.request('Profile/Unfollow', { id: userId });
		} catch (e) {
			console.log(e);
		}
	};

export const emptyProfileFollowers = () => ({
	type: types.EMPTY_PROFILE_FOLLOWERS,
});
