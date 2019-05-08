import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });

export const createPost = ({ message, imageUrl = null, backgroundId = null }) =>
	Service.request('Profile/CreatePost', {
		message,
		imageUrl,
		backgroundId,
	});

// export const uploadMessage = () =>

export const getPostBackgrounds = () =>
	Service.request('Profile/GetPostBackgrounds');
