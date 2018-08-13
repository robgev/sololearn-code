import React from 'react';

const tagRegex = /\[(b|i|u|h1|h2|h3|note|code)(.*?)\]([\s\S\n]*?)\[\/\1\]/;

const imgRegex = /\[img id="(\d+)" width="(\d+)%"\]/;

const U = ({ children }) => <span style={{ textDecoration: 'underline' }}>{children}</span>;

const Note = ({ children }) => <div style={{ backgroundColor: 'yellow' }}>{children}</div>;

const codeRegex = /format="(\w+)"( codeId="(\d+)")?/;

const Code = ({ children, strAttributes }) => {
	// codeId may be undefined
	const [ , codeFormat, codeId ] = codeRegex.exec(strAttributes);
	// TODO: use codeId and codeFormat
	return <div style={{ backgroundColor: 'orange' }}>{children}</div>;
};

const Image = ({ id, width }) =>
	<img alt="" src={`https://api.sololearn.com/DownloadFile?id=${id}`} width={`${width}%`} />;

const noTagParse = (text) => {
	let current = text;
	const result = [];
	while (imgRegex.test(current)) {
		const [ match, id, width ] = imgRegex.exec(current);
		const index = current.indexOf(match);
		result.push(
			current.substring(0, index),
			<Image id={id} width={width} />,
		);
		current = current.substring(current.indexOf(match) + match.length);
	}
	result.push(current);
	return result;
};

const parse = (text) => {
	let current = text;
	const result = [];
	if (!tagRegex.test(current)) {
		return noTagParse(current);
	}
	while (tagRegex.test(current)) {
		const regexed = tagRegex.exec(current);
		const [ match, tag, args, innerText ] = regexed;
		result.push(noTagParse(current.substring(0, current.indexOf(match))));
		const inner = parse(innerText);
		switch (tag) {
		case 'b':
			result.push(<b>{inner}</b>);
			break;
		case 'i':
			result.push(<i>{inner}</i>);
			break;
		case 'u':
			result.push(<U>{inner}</U>);
			break;
		case 'h1':
			result.push(<h1>{inner}</h1>);
			break;
		case 'h2':
			result.push(<h2>{inner}</h2>);
			break;
		case 'h3':
			result.push(<h3>{inner}</h3>);
			break;
		case 'note':
			result.push(<Note>{inner}</Note>);
			break;
		case 'code':
			result.push(<Code strAttributes={args}>{inner}</Code>);
			break;
		default:
			throw new Error('Tag not found during parsing');
		}
		current = current.substring(current.indexOf(match) + match.length);
	}
	result.push(noTagParse(current));
	return result;
};

const Parser = ({ text, style, className }) => (
	<div className={className} style={style}>
		{parse(text)}
	</div>
);

Parser.defaultProps = {
	style: {},
	className: '',
};

export default Parser;
