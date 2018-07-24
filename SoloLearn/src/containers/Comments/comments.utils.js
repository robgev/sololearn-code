export const filterExisting = (comments, newComments) => {
	const ids = comments.map(c =>
		c.id);
	return newComments.filter(c =>
		!ids.includes(c.id));
};
