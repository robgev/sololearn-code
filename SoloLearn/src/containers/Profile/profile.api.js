import Service from 'api/service';

export const getProfile = id => Service.request('Profile/GetProfile', { id });

export const getFeed = ({ fromId, profileId, count }) => Service.request('Profile/GetFeed', { fromId, profileId, count });

export const getFollowing = ({ id, index, count }) => Service.request('Profile/GetFollowing', { id, index, count });

export const getFollowers = ({ id, index, count }) => Service.request('Profile/GetFollowers', { id, index, count });

export const followUser = ({ id, shouldFollow }) => Service.request(`Profile/${shouldFollow ? 'Follow' : 'Unfollow'}`, { id });

export const getCodes = ({ index, count, profileID }) => Service.request('Playground/GetPublicCodes', {
	index, count, orderBy: 3, language: '', query: '', profileID,
});

export const voteFeedItem = ({ url, id, vote }) => Service.request(url, { id, vote });

export const getQuestions = ({ index, profileID, count }) => Service.request('Discussion/Search', {
	index, profileID, query: '', orderBy: 7, count,
});
