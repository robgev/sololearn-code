const numberFormatter = (number, allowTenth) => {
	if (number < 1000) {
		return number;
	}

	let res = tryMinify(number, 1000000000, 'B', allowTenth);
	if (res == null) res = tryMinify(number, 1000000, 'M', allowTenth);
	if (res == null) res = tryMinify(number, 1000, 'K', allowTenth);

	return res;
};

const tryMinify = (number, size, symbol, allowTenth) => {
	let text = null;

	if (number >= size / (allowTenth ? 10 : 1)) {
		const num = number * 1.0 / size;

		text = Math.floor(num);

		const tenNum = Math.floor(num * 10);

		if (num < 100 && num != Math.floor(num) && tenNum % 10 != 0) {
			text += `.${tenNum % 10}`;
		}

		text += symbol;
	}

	return text;
};

export default numberFormatter;
