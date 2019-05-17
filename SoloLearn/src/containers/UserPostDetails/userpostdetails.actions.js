import Service from 'api/service';

export const getUserPost = id =>
	Service.request('Profile/GetPost', { id });
