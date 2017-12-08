const findCommonPrefix = (desiredText, input, result = 0) => (desiredText[0] === input[0] ?
	findCommonPrefix(desiredText.substring(1), input.substring(1), result + 1) :
	result);

export default findCommonPrefix;
