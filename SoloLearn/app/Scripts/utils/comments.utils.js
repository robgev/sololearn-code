export const getComments = (oldComments, newComments) => {
	const similarIndices = [];
	const forcedDowns = oldComments.filter(comment => comment.isForcedDown);
	const notForcedDowns = oldComments.filter(comment => !comment.isForcedDown);
	forcedDowns.forEach((oldCom, idx) =>
		newComments.forEach((newCom) => {
			if (oldCom.id === newCom.id) similarIndices.push(idx);
		}));
	const removedForcedDowns = forcedDowns.filter((comment, idx) => !similarIndices.includes(idx));
	return [ ...notForcedDowns, ...removedForcedDowns, ...newComments ];
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
				return [ ...comments.slice(0, index), ...comments.slice(index) ];
			}
			return [ ...comments, { ...comment, isForcedDown: true } ];
		}
		return [ comment, ...comments ];
	}

	const parentIndex = comments.findIndex(c => c.id === parentId);
	const parent = { ...comments[parentIndex] };
	if (ordering === 2 && parent.repliesArray.length > 0) {
		const replyIndex = parent.repliesArray.findIndex(r => r.votes === 0);
		if (replyIndex !== -1) {
			parent.repliesArray = [
				...parent.repliesArray.slice(0, replyIndex),
				comment,
				...parent.repliesArray.slice(replyIndex),
			];
		}
		parent.repliesArray = [ ...parent.repliesArray, comment ];
	} else {
		parent.repliesArray = [ comment, ...comments ];
	}
	return [ ...comments.slice(0, parentIndex), parent, ...comments.slice(parentIndex) ];
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
	const repliesArray = [ ...getComments(parent.repliesArray.slice(0, -1), replies) ];
	if (!fullyLoaded) {
		repliesArray.push({
			type: 'LOAD_MORE',
			parentId,
		});
	}
	return [
		...comments.slice(0, parentIndex),
		{
			...parent,
			repliesArray,
		},
		...comments.slice(parentIndex + 1) ];
};

export const lastNonForcedDownIndex = (comments) => {
	if (comments.length === 0) return -1;
	const notForcedDowns = comments.filter(comment => !comment.isForcedDown && comment.type !== 'LOAD_MORE');
	return notForcedDowns[notForcedDowns.length - 1].index;
};
