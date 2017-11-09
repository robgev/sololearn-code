import Service from '../api/service';
import { SET_LIKES_LIST } from '../constants/ActionTypes';

const commentTypes = {
	1: 'Playground/GetCodeLikes',
	2: 'Discussion/GetPostLikes',
	3: 'Discussion/GetLessonCommentLikes',
	4: 'Discussion/GetCodeCommentLikes',
	5: 'Discussion/GetUserLessonCommentLikes',
};

export const setLikesList = likes => ({ type: SET_LIKES_LIST, payload: likes });

const getParamsWithIdType = ({
	type, index, id,
}) => {
	const params = { index, count: 20 };
	switch (type) {
	case 1:
		return { ...params, codeId: id };
	case 2:
		return { ...params, postId: id };
	case 3:
	case 4:
	case 5:
		return { ...params, commentId: id };
	default:
		return null;
	}
};

const getLikesInternal = type => id => async (dispatch, getState) => {
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

export default getLikesInternal;
