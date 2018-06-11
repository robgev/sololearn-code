const roundToOneDigit = (number) => {
	const factor = 10 ** 1;
	return Math.round(number * factor) / factor;
};

const numberFormatter = (number) => {
	if (number < 1000) {
		return `${number}`;
	} else if (number < 1000000) {
		return `${roundToOneDigit(number / 1000)}K`;
	} else if (number < 1000000000) {
		return `${roundToOneDigit(number / 1000000)}M`;
	}
	return `${roundToOneDigit(number / 1000000000)}B`;
};

export default numberFormatter;
