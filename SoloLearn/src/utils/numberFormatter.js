const roundToOneDigit = number => Math.round(Math.floor(number * 10)) / 10;

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
