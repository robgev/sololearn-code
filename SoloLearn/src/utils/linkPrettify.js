const replaceWithAliases = text => text.replace(/\+/g, 'p').replace(/#/g, 'sharp');

const toSeoFriendly = (initialText, maxLength = 100) => {
	if (initialText == null) return '';
	const text = replaceWithAliases(initialText);

	const pattern = /[\w]+/g;
	let match = null;
	let result = '';
	let maxLengthHit = false;

	while ((match = pattern.exec(text.toLowerCase())) !== null && !maxLengthHit) {
		if (result.length + match[0].length <= maxLength) {
			result += `${match[0]}-`;
		} else {
			maxLengthHit = true;
			// Handle a situation where there is only one word and it is greater than the max length.
			if (result.length == 0) result = match[0].substring(0, maxLength);
		}
	}

	if (result.length > 0) {
		// Remove trailing '-'
		if (result[result.length - 1] === '-') result = result.substring(0, result.length - 1);
	}

	return result;
};

export default toSeoFriendly;
