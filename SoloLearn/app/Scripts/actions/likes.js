import { curry } from 'lodash';
import Service from 'api/service';
import { SET_LIKES_LIST } from 'constants/ActionTypes';

const commentTypes = {
	codeLikes: 'Playground/GetCodeLikes',
	postLikes: 'Discussion/GetPostLikes',
	lessonCommentLikes: 'Discussion/GetLessonCommentLikes',
	codeCommentLikes: 'Discussion/GetCodeCommentLikes',
	userLessonCommentLikes: 'Discussion/GetUserLessonCommentLikes',
};

export const setLikesList = likes => ({ type: SET_LIKES_LIST, payload: likes });

const getParamsWithIdType = ({
	type, index, id,
}) => {
	const params = { index, count: 20 };
	switch (type) {
	case 'codeLikes':
		return { ...params, codeId: id };
	case 'postLikes':
		return { ...params, postId: id };
	case 'lessonCommentLikes':
	case 'codeCommentLikes':
	case 'userLessonCommentLikes':
		return { ...params, commentId: id };
	default:
		return null;
	}
};

export const getLikesInternal = (type, id) => async (dispatch, getState) => {
	try {
		const { likes } = getState();
		const index = likes ? likes.length : 0;
		const response = await Service.request(commentTypes[type], getParamsWithIdType({
			type, index, id,
		}));
		dispatch(setLikesList(response.users));
	} catch (e) {
		console.log(e);
	}
};

export default curry(getLikesInternal);
