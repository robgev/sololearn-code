import React, { Component } from 'react';
import './Parser.scss';

class Parser extends Component {
	static defaultProps = {
		style: {},
		className: '',
	}

	// static utility funcitons and regexes

	static tagRegex = /\[(b|i|u|h1|h2|h3|note|code)(.*?)\]([\s\S\n]*?)\[\/\1\]/;

	static imgRegex = /\[img id="(\d+)" width="(\d+)%"\]/;

	static codeRegex = /format="(\w+)"( codeId="(\d+)")?/;

	static U = ({ children }) => <span style={{ textDecoration: 'underline' }}>{children}</span>;

	static Note = ({ children }) => <div className="note">{children}</div>;

	static Code = ({ children, strAttributes }) => {
		// codeId may be undefined
		const [ , codeFormat, codeId ] = Parser.codeRegex.exec(strAttributes);
		// TODO:  use codeId and codeFormat
		return <div className="code">{children}</div>;
	};

	static Image = ({ id, width }) =>
		<img alt="" src={`https://api.sololearn.com/DownloadFile?id=${id}`} width={`${width}%`} />;

	// recursive parser
	_parse = (text) => {
		let current = text;
		const result = [];
		if (!Parser.tagRegex.test(current)) {
			return this.noTagParse(current);
		}
		while (Parser.tagRegex.test(current)) {
			const regexed = Parser.tagRegex.exec(current);
			const [ match, tag, args, innerText ] = regexed;
			result.push(this.noTagParse(current.substring(0, current.indexOf(match))));
			const inner = this._parse(innerText);
			switch (tag) {
			case 'b':
				result.push(<b>{inner}</b>);
				break;
			case 'i':
				result.push(<i>{inner}</i>);
				break;
			case 'u':
				result.push(<Parser.U>{inner}</Parser.U>);
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
				result.push(<Parser.Note>{inner}</Parser.Note>);
				break;
			case 'code':
				result.push(<Parser.Code strAttributes={args}>{inner}</Parser.Code>);
				break;
			default:
				throw new Error('Tag not found during parsing');
			}
			current = current.substring(current.indexOf(match) + match.length);
		}
		result.push(this.noTagParse(current));
		return result;
	};

	constructor(props) {
		super(props);
		// Do for performance
		this.filteredGlossary = props.glossary.filter(({ pattern }) =>
			new RegExp(pattern).test(props.text));
		this.text = props.text;
	}
	parse = () => {
		const toBeParsed = this.text.replace('\r\n\r\n', '\r\n');
		return this._parse(toBeParsed);
	}
	// TODO: implement glossary
	// parseGlossary = (text) => {
	// 	const result = [];
	// 	this.filteredGlossary.forEach(({ term, text, pattern }) => {
	// 		let current = text;
	// 		const patternRegExp = new RegExp(pattern);
	// 		while (patternRegExp.test(current)) {
	// 			const [ match ] = patternRegExp.exec(current);
	// 			const index = current.indexOf(match);
	// 			result.push(
	// 				current.substring(0, index),
	// 				<span title={text}>{match}</span>,
	// 			);
	// 			current = current.substring(index + match.length);
	// 		}
	// 	});
	// }
	noTagParse = (text) => {
		let current = text;
		const result = [];
		while (Parser.imgRegex.test(current)) {
			const [ match, id, width ] = Parser.imgRegex.exec(current);
			const index = current.indexOf(match);
			result.push(
				current.substring(0, index),
				<Parser.Image id={id} width={width} />,
			);
			current = current.substring(index + match.length);
		}
		result.push(current);
		return result;
	};
	render() {
		const { className, style } = this.props;
		return (
			<div className={`parser-root ${className}`} style={style}>
				{this.parse()}
			</div>
		);
	}
}

export default Parser;
