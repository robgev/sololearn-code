import Service from '../api/service';
import * as types from '../constants/ActionTypes';
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
	new Promise((resolve, reject) => {
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

		const groupedItems = temp.filter(item => item.groupID == firstItem.groupID);
		temp = temp.filter(item => item.groupID != firstItem.groupID);
		firstItem.groupedItems = groupedItems;

		groupedNotifications.push(firstItem);
	}

	return new Promise((resolve, reject) => {
		resolve(groupedNotifications);
	});
};

export const getNotificationsInternal = (fromId, toId) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	const store = getState();
	const notifications = store.notifications;

	return Service.request('Profile/GetNotifications', { fromId, toId, count: 20 })
		.then((response) => {
			const notifications = response.notifications;
			const count = notifications.length;

			return groupNotificationItems(notifications)
				.then((response) => {
					dispatch(getNotifications(response));

					return count;
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
};

export const markAllRead = () => dispatch =>
	new Promise((resolve, reject) => {
		dispatch({
			type: types.MARK_ALL_READ,
		});
		resolve();
	});

export const markRead = ids => dispatch =>
	new Promise((resolve, reject) => {
		dispatch({
			type: types.MARK_READ,
			payload: ids,
		});
		resolve();
	});

export const markReadInternal = ids => (dispatch) => {
	const dispatchPromise = ids != null ? dispatch(markRead(ids)) : dispatch(markAllRead());
	dispatchPromise
		.then(() => {
			Service.request('Profile/MarkNotificationsClicked', { ids });
		})
		.catch((error) => {
			console.log(error);
		});
};

export const emptyProfile = () => ({
	type: types.EMPTY_PROFILE,
});

export const getFollowers = (followers, fromChallenges) => {
	const type = fromChallenges ? types.GET_CONTEST_FOLLOWERS : types.GET_PROFILE_FOLLOWERS;

	return {
		type,
		payload: followers,
	};
};

export const getFollowersInternal = (index, userId, count = 20, fromChallenges = false) => (
	dispatch,
	getState,
) => {
	if (!getState().imitLoggedin) return;
	return Service.request('Profile/GetFollowers', { id: userId, index, count }).then((response) => {
		const followers = response.users;
		dispatch(getFollowers(followers, fromChallenges));

		return followers.length;
	});
};

export const getFollowing = (following, fromChallenges) => {
	const type = fromChallenges ? types.GET_CONTEST_FOLLOWING : types.GET_PROFILE_FOLLOWING;

	return {
		type,
		payload: following,
	};
};

export const getFollowingInternal = (index, userId, count = 20, fromChallenges = false) => (
	dispatch,
	getState,
) => {
	if (!getState().imitLoggedin) return;
	return Service.request('Profile/GetFollowing', { id: userId, index, count }).then((response) => {
		const following = response.users;
		dispatch(getFollowing(following, fromChallenges));

		return following.length;
	});
};

export const followUser = (userId, fromFollowers, follow) => dispatch =>
	new Promise((resolve, reject) => {
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

export const followUserInternal = (userId, fromFollowers) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	dispatch(followUser(userId, fromFollowers, true))
		.then(() => {
			Service.request('Profile/Follow', { id: userId });
		})
		.catch((error) => {
			console.log(error);
		});
};

export const unfollowUserInternal = (userId, fromFollowers) => (dispatch, getState) => {
	if (!getState().imitLoggedin) return dispatch(changeLoginModal(true));
	dispatch(followUser(userId, fromFollowers, false))
		.then(() => {
			Service.request('Profile/Unfollow', { id: userId });
		})
		.catch((error) => {
			console.log(error);
		});
};

export const emptyProfileFollowers = () => ({
	type: types.EMPTY_PROFILE_FOLLOWERS,
});
