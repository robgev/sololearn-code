import React, { Component } from 'react';
import './Parser.scss';

const flattenGlossaryTerms = (arr) => {
	const res = [];
	arr.forEach(({ terms }) => {
		res.push(...terms);
	});
	return res;
};

const filterGlossary = (glossary, text) => {
	const flatGlossary = flattenGlossaryTerms(glossary);
	const filtered = flatGlossary.filter(({ pattern, term }) => {
		if (pattern !== null) {
			return new RegExp(pattern).test(text);
		}
		return text.includes(term);
	});
	return filtered;
};

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

	static GlossaryItem = ({ glossaryText, children }) => <span title={glossaryText}>{children}</span>

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
		this.filteredGlossary = filterGlossary(props.glossary, props.text);
		this.text = props.text;
	}
	parse = () => {
		const toBeParsed = this.text.replace('\r\n\r\n', '\r\n');
		return this._parse(toBeParsed);
	}
	parseGlossary = (fullText) => {
		const allItems = [];
		this.filteredGlossary.forEach(({ text, pattern, term }) => {
			const patternRegExp = pattern !== null ? new RegExp(pattern) : new RegExp(term);
			let current = fullText;
			while (patternRegExp.test(current)) {
				const [ match ] = patternRegExp.exec(current);
				const index = current.indexOf(match);
				allItems.push({
					item: <Parser.GlossaryItem glossaryText={text}>{match}</Parser.GlossaryItem>,
					offset: index + fullText.indexOf(current),
					length: match.length,
				});
				current = current.substring(index + match.length);
			}
		});
		allItems.sort((a, b) => b.offset - a.offset);
		const result = [];
		if (allItems.length === 0) {
			return fullText;
		}
		allItems.forEach((el, index, arr) => {
			const start = index === 0 ? 0 : arr[index - 1].offset + arr[index - 1].length;
			result.push(
				fullText.substring(start, el.offset),
				el.item,
			);
			if (index === arr.length - 1) {
				result.push(fullText.substring(start + el.offset + el.length));
			}
		});
		return result;
	}
	noTagParse = (text) => {
		let current = text;
		const result = [];
		while (Parser.imgRegex.test(current)) {
			const [ match, id, width ] = Parser.imgRegex.exec(current);
			const index = current.indexOf(match);
			result.push(
				this.parseGlossary(current.substring(0, index)),
				<Parser.Image id={id} width={width} />,
			);
			current = current.substring(index + match.length);
		}
		result.push(this.parseGlossary(current));
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
