import Service from 'api/service';

export const createQuestion = ({ title, message, tags }) =>
	Service.request('Discussion/CreatePost', { title, message, tags });

export const editQuestion = ({
 id, title, message, tags 
}) =>
	Service.request('Discussion/EditPost', {
 id, message, title, tags 
});
