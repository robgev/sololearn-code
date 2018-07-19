import { findIndex } from 'lodash';

const repliesOfId = (comments, id) => {
	const firstReplyIndex = findIndex(comments, el => el.id === id) + 1;
	const countOfReplies = findIndex(comments.slice(firstReplyIndex), el => el.parentID == null);
	return comments.slice(firstReplyIndex, firstReplyIndex + countOfReplies);
};

export default repliesOfId;
