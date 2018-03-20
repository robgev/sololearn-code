export default (accessNumber) => {
	if ((accessNumber & 2) === 2) { // eslint-disable-line no-bitwise
		return 1;
	}
	if ((accessNumber & 4) === 4) { // eslint-disable-line no-bitwise
		return 2;
	}
	if ((accessNumber & 8) === 8) { // eslint-disable-line no-bitwise
		return 3;
	}
	return 0;
};
