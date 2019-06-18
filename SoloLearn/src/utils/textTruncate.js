const truncate = (text, maxLength, maxLines, addElipsis) => {
	let truncatedText = text;
	let isTruncated = false;

	const lines = text.split('\n');

	if (lines.length > maxLines) {
		isTruncated = true;
		truncatedText = lines.reduce((acc, item, idx) => (idx + 1 > maxLines ? acc : `${acc}${item}${idx + 1 === maxLines ? '' : '\n'}`), '');
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
