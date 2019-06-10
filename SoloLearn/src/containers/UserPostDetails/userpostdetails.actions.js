import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });

export const deleteUserPost = id =>
	Service.request('Profile/DeletePost', { id });

export const sendImpressionByPostId = id =>
	Service.request(`Profile/AddPostImpression?id=${id}`);

export const requestPostRemoval = id => Service.request('ReportItem', {
	itemType: 9,
	reason: 100, // Server reason for moderator prompt.
	itemId: id,
});
