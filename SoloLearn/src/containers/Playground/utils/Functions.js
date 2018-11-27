import * as regexes from './Regexes';

// ----------------------------- External resources manipulation ------------------------------
const wrapWithHtml = (code) => {
	if (!regexes.htmlWrapperRegex.test(code)) { // if is not wrapped with html tag
		return `<html>\n\t${code}\n</html>`;
	}
	return code;
};

const appendAfterHtml = ({ code, value }) => {
	const [ beforeHtml = '', afterHtml = '' ] = code.split(regexes.htmlOpenTag);
	return `${beforeHtml.trim()}\n<html>\n\t${value}\n${afterHtml.trim()}`;
};

const appendBeforeHtmlClosing = ({ code, value }) => {
	const [ beforeClose = '', afterClose = '' ] = code.split(regexes.htmlCloseTag);
	return `${beforeClose.trim()}\n\t${value}\n</html>\n${afterClose.trim()}`;
};

const appendHead = ({ code, value }) => {
	const [ beforeHead = '', headValue = '', afterHead = '' ] = code.split(regexes.headWrapperRegex);
	return appendAfterHtml({
		code: `${beforeHead.trim()}${afterHead.trim()}`,
		value: `<head>\n\t\t${headValue.trim()}\n\t\t${value}\n</head>`,
	});
};

const appendBody = ({ code, value }) => {
	const [ beforeBody = '', bodyValue = '', afterBody = '' ] = code.split(regexes.bodyWrapperRegex);
	return appendBeforeHtmlClosing({
		code: `${beforeBody.trim()}${afterBody.trim()}`,
		value: `<body>\n\t${bodyValue.trim()}\n${value}</body>`,
	});
};

const addInHead = (code, value) => {
	if (!regexes.headWrapperRegex.test(code)) {
		return appendAfterHtml({
			code,
			value: `<head>\n\t${value}\n</head>`,
		});
	}
	return appendHead({ code, value });
};

const addInBody = (code, value) => {
	if (!regexes.bodyWrapperRegex.test(code)) {
		return appendBeforeHtmlClosing({
			code,
			value: `<body>\n\t${value}\n</body>`,
		});
	}
	return appendBody({ code, value });
};

export const addExternal = ({ code, value }) =>
	addInHead(wrapWithHtml(code), value); // kinda curry(code, [ wrapWithHtml, addInHead ])

export const addUserScript = ({ code, value }) =>
	addInBody(wrapWithHtml(code), value);

// ------------------------------ Saving manipulation ------------------------------
export const wrapCodeWithComment = ({ editorState, userName, language }) => {
	let { sourceCode } = editorState;
	const cssCode = `/* Created by ${userName} */\n${editorState.cssCode}`;
	const jsCode = `// Created by ${userName}\n${editorState.jsCode}`;
	switch (language) {
	case 'html':
		sourceCode = `<!-- Created by ${userName} -->\n${sourceCode}`;
		break;
	case 'cpp': case 'cs': case 'java': case 'php':
		sourceCode = `// Created by ${userName}\n${sourceCode}`;
		break;
	case 'py': case 'rb':
		sourceCode = `# Created by ${userName}\n${sourceCode}`;
		break;
	default:
		break;
	}
	return { sourceCode, cssCode, jsCode };
};

// ------------------------------ Running ------------------------------
export const checkForInput = ({ code, language }) => {
	// Legacy code, don't know why we need this replaces, don't wanna touch
	if (language === 'py') {
		const codeBlock = code.replace(/(([^'"])(#)|(^#))((.*)$)/gm, '');
		const inputRegex = regexes[language];
		return inputRegex.test(codeBlock);
	} else if (language === 'rb') {
		const codeBlock = code.replace(/(=begin(\n[\s\S]*?)=end)|(([^'"])(#)|(^#))((.*)$)/gm, '');
		const inputRegex = regexes[language];
		return inputRegex.test(codeBlock);
	}

	const codeBlock = code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
	const inputRegex = regexes[language];
	return inputRegex.test(codeBlock);
};
