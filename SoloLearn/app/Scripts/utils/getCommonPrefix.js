export default (str1, str2) => str1
	.split('')
	.reduce((acc, curr, i) => (!acc.break && curr === str2[i]
		? ({ text: acc.text + curr, break: false })
		: ({ text: acc.text, break: true })), { text: '', break: false }).text;
