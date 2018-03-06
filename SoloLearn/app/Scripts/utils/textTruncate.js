const truncate = (text, maxLength, maxLines, addElipsis) => {
	let truncatedText = text;
	let isTruncated = false;

	const lines = text.split('\n');

	if (lines.length > maxLines) {
		isTruncated = true;
		truncatedText = `${lines[0]}\n${lines[1]}\n${lines[2]}\n${lines[4]}\n${lines[5]}`;
	}
	if (truncatedText.length > maxLength) {
		isTruncated = true;
		truncatedText = truncatedText.substring(0, maxLength);
	}

	if (addElipsis) {
		truncatedText += isTruncated ? ' ...' : '';
	}

	return truncatedText;
};

export default truncate;
