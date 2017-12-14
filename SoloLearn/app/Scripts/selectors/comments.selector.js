import { createSelector } from 'reselect';

const getRawComments = state => state.comments.data;

export const getSelectedCommentId = state => state.comments.selected;

export const getComments = createSelector(
	getRawComments,
	(comments) => {
		const flattened = [];
		comments.forEach((comment) => {
			flattened.push(comment);
			if (comment.repliesArray != null) {
				comment.repliesArray.forEach(reply => flattened.push(reply));
			}
		});
		return flattened;
	},
);
