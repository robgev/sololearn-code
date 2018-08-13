// React modules
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import Radium, { Style } from 'radium';
import { Parser } from 'utils';

// Service & others
import Service from 'api/service';
import { getPosition, updateDate } from 'utils';
import SlayLessonToolbar from './SlayLessonToolbar';
import CodeBlock from './CodeBlock';

const tooltipOpened = (<Style
	scopeSelector=".tooltip-content.open"
	rules={{
		div: {
			visibility: 'visible !important',
			opacity: '0.9 !important',
		},
	}}
/>);

const tooltipTopPlaced = (<Style
	scopeSelector=".tooltip-content.top"
	rules={{
		'.tooltip': {
			marginTop: '-10px !important',
		},
		'.tooltip-arrow': {
			borderTopColor: '#222',
			borderTopStyle: 'solid',
			borderTopWidth: '6px',
			borderLeft: '5px solid transparent',
			borderRight: '5px solid transparent',
			bottom: '-6px',
			left: '50%',
			marginLeft: '-8px',
		},
	}}
/>);

const tooltipBottomPlaced = (<Style
	scopeSelector=".tooltip-content.bottom"
	rules={{
		'.tooltip': {
			marginTop: '10px !important',
		},
		'.tooltip-arrow': {
			borderBottomColor: '#222',
			borderBottomStyle: 'solid',
			borderBottomWidth: '6px',
			borderLeft: '5px solid transparent',
			borderRight: '5px solid transparent',
			top: '-6px',
			left: '50%',
			marginLeft: '-8px',
		},
	}}
/>);

const tooltipRightPlaced = (<Style
	scopeSelector=".tooltip-content.right"
	rules={{
		'.tooltip': {
			marginLeft: '10px',
		},
		'.tooltip-arrow': {
			borderRightColor: '#222',
			borderRightStyle: 'solid',
			borderRightWidth: '6px',
			borderTop: '5px solid transparent',
			borderBottom: '5px solid transparent',
			left: '-6px',
			top: '50%',
			marginTop: '-4px',
		},
	}}
/>);

const tooltipLeftPlaced = (<Style
	scopeSelector=".tooltip-content.left"
	rules={{
		'.tooltip': {
			marginLeft: '-10px',
		},
		'.tooltip-arrow': {
			borderLeftColor: '#222',
			borderLeftStyle: 'solid',
			borderLeftWidth: '6px',
			borderTop: '5px solid transparent',
			borderBottom: '5px solid transparent',
			right: '-6px',
			top: '50%',
			marginTop: '-4px',
		},
	}}
/>);

const styles = {
	textContainer: {
		width: '100%',
		marginBottom: 10,
		overflow: 'hidden',
	},

	tooltipWrapper: {
		position: 'relative',
		cursor: 'pointer',
		color: 'rgb(54, 171, 203)',
		whiteSpace: 'normal',
	},

	glossaryItem: {
		display: 'inline-block',
	},

	tooltip: {
		width: '200px',
		textAlign: 'center',
		borderRadius: '3px',
		display: 'inline-block',
		fontSize: '13px',
		fontWeight: 'normal',
		visibility: 'hidden',
		opacity: 0,
		padding: '8px 0',
		position: 'fixed',
		transition: 'opacity 0.3s ease-out',
		zIndex: '999',
		color: '#fff',
		backgroundColor: '#222',
	},

	tooltipArrow: {
		position: 'absolute',
	},

	noteBlock: {
		border: 'solid 1px #ddd',
		margin: '10px 20px',
		background: '#eeea87',
		display: 'block',
	},

	note: {
		padding: '10px',
		borderLeft: '5px solid #c9c54c',
		display: 'block',
	},
};

const TextContent = props => (
	<div dangerouslySetInnerHTML={{ __html: props.html }} />
);

const NoteBlock = props => (
	<div className="note-block" style={styles.noteBlock}>
		<span className="note" style={styles.note} dangerouslySetInnerHTML={{ __html: props.noteText }} />
	</div>
);

const ImageBlock = props => (
	<div className="image-block">
		<img src={`https://api.sololearn.com/DownloadFile?id=${props.id}`} width={props.width} />
	</div>
);

class QuizText extends Component {
	constructor(props) {
		super(props);
		const { pathname } = browserHistory.getCurrentLocation();
		this.state = {
			pathname,
			isBookmarked: props.isBookmarked,
		};

		this.headersPositions = [];
	}

	openTooltip(e, glossaryItem, placement) {
		const tooltipContent = glossaryItem.parentNode;
		const tooltip = tooltipContent.querySelector('.tooltip');

		const result = getPosition(e, e.target, tooltip, placement, 'solid', {}, true);

		if (result.isNewState) {
			this.openTooltip(e, glossaryItem, result.newState.place);
		} else {
			tooltipContent.className += ` ${placement}`;
			tooltip.style.top = result.position.top;
			tooltip.style.left = result.position.left;

			tooltipContent.className += ' open';
		}
	}

	closeTooltip(e, glossaryItem) {
		const tooltipContent = glossaryItem.parentNode;
		tooltipContent.className = 'tooltip-content';
	}

	getTootlip(text, tooltipText) {
		const glossaryItem = React.createElement(
			'span',
			{ style: styles.glossaryItem, className: 'glossary-item' },
			text.replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
		);

		const tooltipData = React.createElement(
			'span',
			{ className: 'tooltip-text' },
			tooltipText,
		);

		const tooltipArrow = React.createElement(
			'span',
			{ style: styles.tooltipArrow, className: 'tooltip-arrow' },
		);

		const tooltip = React.createElement(
			'div',
			{ style: styles.tooltip, className: 'tooltip' },
			tooltipData,
			tooltipArrow,
		);

		const glossaryItemHtml = ReactDOMServer.renderToStaticMarkup(glossaryItem);
		const tooltipHtml = ReactDOMServer.renderToStaticMarkup(tooltip);

		const innerHtml = glossaryItemHtml + tooltipHtml;

		return (
			<span className="tooltip-content" style={styles.tooltipWrapper} data-text={tooltipText} dangerouslySetInnerHTML={{ __html: innerHtml }} />
		);
	}

	getHeaderPositions(text) {
		const headersRegex = /(\[)(h1|h2|h3)(\])(.*)(\[\/)(h1|h2|h3)(\])/g;
		let match = null;

		while ((match = headersRegex.exec(text)) !== null) {
			this.headersPositions.push({
				start: match.index,
				end: match.index + match[0].length,
			});
		}
	}

	tooltipBetweenHeaders(startIndex) {
		for (let i = 0; i < this.headersPositions.length; i++) {
			const positions = this.headersPositions[i];
			if (startIndex > positions.start && startIndex < positions.end) return true;
		}

		return false;
	}

	generateTooltips(text) {
		const glossary = this.props.glossary;

		if (glossary != null) {
			for (let i = 0; i < glossary.length; i++) {
				const currentTerms = glossary[i].terms;
				for (let j = 0; j < currentTerms.length; j++) {
					if (currentTerms[j].pattern != null) {
						let pattern = currentTerms[j].pattern;
						if (!(pattern.indexOf('(?<') > -1)) {
							pattern = pattern.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;');

							pattern = `(${pattern})`;

							const patternRegex = new RegExp(pattern, 'g');

							text = text.replace(patternRegex, (...params) => {
								const matchedString = params[0];
								if (this.tooltipBetweenHeaders(params[params.length - 2])) return matchedString;

								const tooltip = this.getTootlip(matchedString, currentTerms[j].text);
								const tooltipHTML = ReactDOMServer.renderToStaticMarkup(tooltip);

								return tooltipHTML;
							});
						}
					} else {
						let term = '';
						let replacedTerm = currentTerms[j].term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
						let termRegex = '';

						if (currentTerms[j].term.charAt(0) == '<') {
							replacedTerm = replacedTerm.replace(/</g, '&lt;')
								.replace(/>/g, '&gt;');

							term = `(${replacedTerm})`;
							termRegex = new RegExp(term, 'g');

							text = text.replace(termRegex, (...params) => {
								const matchedString = params[0];
								if (this.tooltipBetweenHeaders(params[params.length - 2])) return matchedString;

								const tooltip = this.getTootlip(matchedString, currentTerms[j].text);
								const tooltipHTML = ReactDOMServer.renderToStaticMarkup(tooltip);

								return tooltipHTML;
							});
						} else {
							term = `(^|\\b)(${replacedTerm})(?=\\b|$)`;
							termRegex = new RegExp(term, 'g');

							text = text.replace(termRegex, (...params) => {
								const matchedString = params[1];
								if (this.tooltipBetweenHeaders(params[params.length - 2])) return matchedString;

								const tooltip = this.getTootlip(matchedString, currentTerms[j].text);
								const tooltipHTML = ReactDOMServer.renderToStaticMarkup(tooltip);

								return tooltipHTML;
							});
						}
					}
				}
			}
		}

		return text;
	}

	generateBlocks(text) {
		const componentParts = [];
		let blockMatch = null;
		const blocksRegex = /((\[code format=")([a-zA-Z]+)(\" ?)((codeId=")([0-9]+)(\"))?]([\s\S]*?)(\[\/code]))|((\[note])([\s\S]*?)(\[\/note]))|((\[img id=")([0-9]+)(\" )(width=")([0-9]+%)(\")(\]))/g;
		let endIndex = 0;

		while ((blockMatch = blocksRegex.exec(text)) !== null) {
			const type = blockMatch[1] ? 'code' : (blockMatch[11] ? 'note' : 'img');

			const textComponentData = {
				componentType: 'text',
				props: {
					html: text.substring(endIndex, blockMatch.index),
				},
			};

			componentParts.push(textComponentData);

			const blockComponentData = {
				componentType: type,
				props: {
					format: blockMatch[3],
					codeId: blockMatch[7],
					codeText: blockMatch[9],
					noteText: blockMatch[13],
					imgId: blockMatch[17],
					imgWidth: blockMatch[20],
				},
			};

			componentParts.push(blockComponentData);

			endIndex = blockMatch.index + blockMatch[0].length;
		}

		if (endIndex != text.length) {
			const textComponentData = {
				componentType: 'text',
				props: {
					html: text.substring(endIndex),
				},
			};

			componentParts.push(textComponentData);
		}

		return componentParts;
	}

	formattingText() {
		const that = this;
		const anchorRegex = /\[a((\s+[\w\d]+="?[-a-zA-Z0-9@:%_\\\\+.~#?&/=]*"?)*)\s*\](.*?)\[\/a\]/g;
		let text = this.props.textContent;

		const glossaryText = [];

		this.getHeaderPositions(text);

		text = text.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');

		text = this.generateTooltips(text);

		text = text.replace(/\r\n/g, '<br/>')
			.replace(/\n/g, '<br/>')
			.replace(/(\[)(\/?(b|i|u))(\])/g, '<' + '$2' + '>')
			.replace(/(\[)(h1|h2|h3)(\])/g, '<' + '$2' + '>')
			.replace(/(\[\/)(h1|h2|h3)(\])/g, '</' + '$2' + '>')
			.replace(anchorRegex, '<a class="hoverable"' + '$2' + '>' + '$3' + '</a>');

		return this.generateBlocks(text);
	}

	renderComponentParts() {
		const { courseLanguage } = this.props;
		const { pathname } = this.state;
		const renderItems = this.formattingText();

		return renderItems.map((element, index) => {
			switch (element.componentType) {
			case 'text':
				return <TextContent html={element.props.html} key={index} />;
			case 'code':
				return (
					<CodeBlock
						key={index}
						basePath={pathname}
						text={element.props.codeText}
						codeId={element.props.codeId}
						format={element.props.format}
						courseLanguage={courseLanguage}
					/>
				);
			case 'note':
				return <NoteBlock noteText={element.props.noteText} key={index} />;
			case 'img':
				return <ImageBlock id={element.props.imgId} width={element.props.imgWidth} key={index} />;
			}
		});
	}

	toggleBookmark = async () => {
		const { quizId: id, type } = this.props;
		const { isBookmarked: bookmark } = this.state;
		const { isBookmarked } =
			await Service.request('/BookmarkLesson', { id, type, bookmark: !bookmark });
		this.setState({ isBookmarked });
	}

	render() {
		const { isBookmarked } = this.state;
		const {
			withToolbar, userData, date, quizId,
		} = this.props;
		return (
			<div className="text-container" style={styles.textContainer}>
				{/* {tooltipOpened}
				{tooltipTopPlaced}
				{tooltipRightPlaced}
				{tooltipLeftPlaced}
				{tooltipBottomPlaced}
				<div id="text-content">{this.renderComponentParts()}</div>
				{withToolbar &&
					<SlayLessonToolbar
						id={quizId}
						userData={userData}
						isBookmarked={isBookmarked}
						timePassed={updateDate(date)}
						toggleBookmark={this.toggleBookmark}
					/>
				} */}
				<Parser text={this.props.textContent} />
			</div>
		);
	}

	componentDidUpdate() {
		const glossaryItems = document.getElementsByClassName('glossary-item');
		for (let i = 0; i < glossaryItems.length; i++) {
			const item = glossaryItems[i];
			item.addEventListener('mouseleave', e => this.closeTooltip(e, item));
			item.addEventListener('mouseenter', e => this.openTooltip(e, item, 'right'));
		}
	}

	// REMOVE EVENT LISTENERS
}

export default translate()(Radium(QuizText));
