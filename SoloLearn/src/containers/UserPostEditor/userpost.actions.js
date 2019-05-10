import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });

export const createPost = ({ message = null, imageUrl = null, backgroundId = null }) =>
	Service.request('Profile/CreatePost', {
		message,
		imageUrl,
		backgroundId,
	});

export const uploadPostImage = (file, name) =>
	Service.fileRequest(`Profile/UploadPostImage?name=${name}`, file);

export const getPostBackgrounds = () =>
	Service.request('Profile/GetPostBackgrounds');
