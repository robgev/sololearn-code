import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });

export const createPost = ({ message = null, backgroundId = null, imageUrl = null }) =>
	Service.request('Profile/CreatePost', {
		message,
		backgroundId,
		imageUrl,
	});

export const uploadPostImage = (file, name) =>
	Service.fileRequest(`Profile/UploadPostImage?name=${name}`, file);

export const getPostBackgrounds = () =>
	Service.request('Profile/GetPostBackgrounds');
