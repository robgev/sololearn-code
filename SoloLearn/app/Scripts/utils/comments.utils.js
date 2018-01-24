const LOAD_MORE = 'LOAD_MORE';

const removeLoadMores = (comments, { above }) =>
	comments.filter(c => !(c.type === LOAD_MORE && c.loadAbove === above));

const hasAbove = (comments, parentId = null) => {
	if (comments.length && comments[0].index <= 0) return comments;
	return [ { type: LOAD_MORE, parentId, loadAbove: true }, ...comments ];
};

const hasRepliesBelow = (comments, parentId, fullyLoaded) => {
	if (fullyLoaded) return comments;
	return [ ...comments, { type: LOAD_MORE, loadAbove: false, parentId } ];
};

export const getComments = (oldComments, newComments) => {
	const similarIndices = [];
	const forcedDowns = oldComments.filter(comment => comment.isForcedDown);
	const notForcedDowns = removeLoadMores(oldComments.filter(comment => !comment.isForcedDown), { above: false });
	forcedDowns.forEach((oldCom, idx) =>
		newComments.forEach((newCom) => {
			if (oldCom.id === newCom.id) similarIndices.push(idx);
		}));
	const removedForcedDowns = forcedDowns.filter((comment, idx) => !similarIndices.includes(idx));
	return hasAbove(removeLoadMores(
		[ ...notForcedDowns, ...newComments, ...removedForcedDowns ],
		{ above: true },
	));
};

export const voteComment = (comments, {
	id, parentId, vote, votes,
}) => {
	if (parentId == null) {
		const index = comments.findIndex(c => c.id === id);
		const comment = comments[index];
		return [
			...comments.slice(0, index), { ...comment, vote, votes }, ...comments.slice(index + 1),
		];
	}

	const parentIndex = comments.findIndex(c => c.id === parentId);
	const parent = { ...comments[parentIndex] };
	const replyIndex = parent.repliesArray.findIndex(r => r.id === id);
	const reply = parent.repliesArray[replyIndex];
	parent.repliesArray =
		[
			...parent.repliesArray.slice(0, replyIndex),
			{ ...reply, vote, votes },
			...parent.repliesArray.slice(replyIndex + 1),
		];
	return [ ...comments.slice(0, parentIndex), parent, ...comments.slice(parentIndex + 1) ];
};

export const addComment = (comments, { comment, ordering, parentId }) => {
	if (parentId == null) {
		if (ordering === 2 && comments.length > 0) {
			const index = comments.findIndex(c => c.votes === 0);
			if (index !== -1) {
				return [ ...comments.slice(0, index), comment, ...comments.slice(index) ];
			}
			return [ ...comments, { ...comment, isForcedDown: true } ];
		}
		return hasAbove(removeLoadMores([ comment, ...comments ], { above: true }));
	}

	const parentIndex = comments.findIndex(c => c.id === parentId);
	const parent = { ...comments[parentIndex] };
	parent.replies += 1;
	parent.repliesArray = hasRepliesBelow(
		removeLoadMores(
			[ ...parent.repliesArray, { ...comment, isForcedDown: true } ],
			{ above: false },
		),
		parent.id,
		parent.repliesArray.length > 0 && !parent.repliesArray[parent.repliesArray.length - 1].type === LOAD_MORE,
	);
	return [ ...comments.slice(0, parentIndex), parent, ...comments.slice(parentIndex + 1) ];
};

export const deleteComment = (comments, { id, parentId }) => {
	if (parentId == null) {
		return comments.filter(comment => comment.id !== id);
	}

	const parentIndex = comments.findIndex(comment => comment.id === parentId);
	const parent = comments[parentIndex];
	return [
		...comments.slice(0, parentIndex),
		{ ...parent, repliesArray: parent.repliesArray.filter(comment => comment.id !== id) },
		...comments.slice(parentIndex + 1) ];
};

export const editComment = (comments, { id, parentId, message }) => {
	if (parentId == null) {
		return comments.map(comment => (comment.id === id ? { ...comment, message } : comment));
	}

	const parentIndex = comments.findIndex(comment => comment.id === parentId);
	const parent = comments[parentIndex];
	return [
		...comments.slice(0, parentIndex),
		{
			...parent,
			repliesArray: parent.repliesArray.map(comment =>
				(comment.id === id ? { ...comment, message } : comment)),
		},
		...comments.slice(parentIndex + 1) ];
};

export const getCommentReplies = (comments, { parentId, replies, fullyLoaded }) => {
	const parentIndex = comments.findIndex(comment => comment.id === parentId);
	const parent = comments[parentIndex];
	const repliesArray = hasRepliesBelow(
		removeLoadMores(getComments(parent.repliesArray, replies), { above: false }),
		parentId,
		fullyLoaded,
	);
	return [
		...comments.slice(0, parentIndex),
		{
			...parent,
			repliesArray,
		},
		...comments.slice(parentIndex + 1) ];
};

export const getCommentsAbove = (comments, { aboveComments }) =>
	hasAbove(removeLoadMores([ ...aboveComments, ...comments ], { above: true }));

export const getRepliesAbove = (parent, { aboveComments }) => {
	const repliesArray = hasAbove(
		removeLoadMores(
			[ ...aboveComments, ...parent.repliesArray ],
			{ above: true },
		),
		parent.id,
	);
	return [ {
		...parent,
		repliesArray,
	} ];
};

export const lastNonForcedDownIndex = (comments) => {
	const notForcedDowns = comments.filter(comment =>
		!comment.isForcedDown && comment.type !== LOAD_MORE);
	if (!notForcedDowns.length) return -1;
	const { index } = notForcedDowns[notForcedDowns.length - 1];
	return index === -1 ? -2 : index;
};

export const notForcedDownCount = comments => comments.filter(c => !c.isForcedDown).length;
