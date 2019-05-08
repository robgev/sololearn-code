import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });

export const createPost = () =>
	Service.request('Profile/CreatePost');

export const getPostBackgrounds = () =>
	Service.request('Profile/GetPostBackgrounds');
