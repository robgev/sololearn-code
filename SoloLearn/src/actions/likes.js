import { curry } from 'lodash';
import Service from 'api/service';
import { SET_LIKES_LIST, EMPTY_LIKES_LIST } from 'constants/ActionTypes';

const commentTypes = {
	codeLikes: 'Playground/GetCodeLikes',
	postLikes: 'Discussion/GetPostLikes',
	lessonCommentLikes: 'Discussion/GetLessonCommentLikes',
	codeCommentLikes: 'Discussion/GetCodeCommentLikes',
	userLessonCommentLikes: 'Discussion/GetUserLessonCommentLikes',
	codeDownvotes: 'Playground/GetCodeDownvotes',
	postDownvotes: 'Discussion/GetPostDownvotes',
	lessonCommentDownvotes: 'Discussion/GetLessonCommentDownvotes',
	codeCommentDownvotes: 'Discussion/GetCodeCommentDownvotes',
	userLessonCommentDownvotes: 'Discussion/GetUserLessonCommentDownvotes',
};

const setLikesList = likes => ({ type: SET_LIKES_LIST, payload: likes });
export const emptyLikesList = () => ({ type: EMPTY_LIKES_LIST });

const getParamsWithIdType = ({
	type, index, id,
}) => {
	const params = { index, count: 20 };
	switch (type) {
	case 'codeLikes':
	case 'codeDownvotes':
		return { ...params, codeId: id };
	case 'postLikes':
	case 'postDownvotes':
		return { ...params, postId: id };
	case 'lessonCommentLikes':
	case 'codeCommentLikes':
	case 'userLessonCommentLikes':
	case 'lessonCommentDownvotes':
	case 'codeCommentDownvotes':
	case 'userLessonCommentDownvotes':
		return { ...params, commentId: id };
	default:
		return null;
	}
};

export const getLikesAndDownvotesInternal = (type, id) => async (dispatch, getState) => {
	try {
		const { likes } = getState();
		const index = likes.length;
		const response = await Service.request(commentTypes[type], getParamsWithIdType({
			type, index, id,
		}));
		dispatch(setLikesList(response.users));
		return response.users.length;
	} catch (e) {
		console.log(e);
	}
};

export default curry(getLikesAndDownvotesInternal);
