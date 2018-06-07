export const getClosestAt = (text, currPos) => {
	for (let i = currPos; i >= 0; i -= 1) {
		if (text.charAt(i) === '@') {
			return i;
		}
	}
	return null;
};

export const mentionTags = (text, tags) => {
	if (tags.length === 0) {
		return text;
	}
	const [ tag, ...nextTags ] = tags;
	return mentionTags(
		text.replace(
			tag.name,
			`[user id="${tag.id}"]${tag.name.slice(1)}[/user]`,
		),
		nextTags,
	);
};
