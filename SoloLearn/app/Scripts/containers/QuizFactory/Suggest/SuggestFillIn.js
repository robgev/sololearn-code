import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor, EditorState, Modifier, CompositeDecorator, convertToRaw } from 'draft-js';
import { Paper, RaisedButton, FlatButton } from 'material-ui';
import ChooseLanugage from '../components/ChooseLanguage';

// Util pure functions

const markedStrategy = (contentBlock, callback, contentState) => {
	contentBlock.findEntityRanges((character) => {
		const entityKey = character.getEntity();
		return (
			entityKey !== null &&
			contentState.getEntity(entityKey).getType() === 'MARKED'
		);
	}, callback);
};

const Marked = ({ children }) => <span className="marked">{children}</span>;

// Change marked text to {index} and get results from blocks
const markTextBlock = (raw, ranges, index) => (ranges.length > 0 ? ranges
	.reduce((acc, curr, idx, arr) => {
		const before = idx === 0
			? raw.substring(0, curr.offset)
			: raw.substring(arr[idx - 1].offset + arr[idx - 1].length, curr.offset);
		const currentText = `${before}{${acc.index}}`;
		const text = `${acc.text}${currentText}${idx === arr.length - 1 ? raw.substring(curr.offset + curr.length) : ''}`;
		const answers = [ ...acc.answers, raw.substr(curr.offset, curr.length) ];
		return { answers, text, index: acc.index + 1 };
	}, { answers: [], text: '', index }) : { answers: [], text: raw, index });

class SuggestFillIn extends Component {
	state = {
		language: null,
		isLanguageSelectorOpen: false,
		question: 'Fill in the blanks to ',
		editorState: EditorState.createEmpty(new CompositeDecorator([
			{ strategy: markedStrategy, component: Marked },
		])),
	}
	toggleLanguageSelector = () => {
		this.setState(state => ({ isLanguageSelectorOpen: !state.isLanguageSelectorOpen }));
	}
	selectLanguage = (language) => {
		this.setState({ language });
		this.toggleLanguageSelector();
	}
	onQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	}
	onEditorChange = (editorState) => {
		this.setState({ editorState });
	}
	focusEditor = () => {
		this.editor.focus();
	}
	hasSelection = (editorState) => {
		const selection = editorState.getSelection();
		const start = selection.getStartOffset();
		const end = selection.getEndOffset();
		return start !== end;
	}
	markHighlighted = () => {
		const { editorState } = this.state;
		if (this.hasSelection(editorState)) {
			const contentState = editorState.getCurrentContent();
			const contentStateWithEntity = contentState.createEntity(
				'MARKED',
				'MUTABLE',
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const contentStateWithMarked = Modifier.applyEntity(
				contentStateWithEntity,
				editorState.getSelection(),
				entityKey,
			);
			this.setState({
				editorState: EditorState.set(editorState, { currentContent: contentStateWithMarked }),
			});
		}
	}
	getEditorContent = () => convertToRaw(this.state.editorState.getCurrentContent());
	isComplete = () =>
		this.state.language !== null &&
		this.state.question.length !== 0 &&
		this.getEditorContent().blocks.some(block => block.entityRanges.length !== 0);
	makeQuiz = () => {
		const { blocks } = this.getEditorContent();
		const { answers, question } = blocks.reduce((acc, block) => {
			const { answers: currAnswers, text: currText, index } =
				markTextBlock(block.text, block.entityRanges, acc.index);
			return {
				answers: [ ...acc.answers, ...currAnswers ],
				question: `${acc.question}${currText}\r\n`,
				index,
			};
		}, { answers: [], question: '', index: 0 });
		return {
			answers: answers.map((a, id) => ({
				text: a, id, isCorrect: true, properties: { prefix: '', postfix: '' },
			})),
			language: this.state.language.id,
			question: `${this.state.question}[!html!]${question}`,
			type: 3,
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	render() {
		const {
			isLanguageSelectorOpen, language, question, editorState,
		} = this.state;
		return (
			<div className="quiz-factory">
				<Paper onClick={this.toggleLanguageSelector} className="selected-language container">
					<span className="title">Language</span>
					<div className="with-image">
						<span className="language-name">{language === null ? 'Select' : language.languageName}</span>
						<img src="/assets/keyboard_arrow_right.svg" alt="" />
					</div>
				</Paper>
				<Paper className="question container">
					<span className="title">Question</span>
					<textarea value={question} onChange={this.onQuestionChange} placeholder="Type in Your Question" />
				</Paper>
				<Paper className="container editor-box">
					<div className="title-with-button">
						<span className="title">Code</span>
						<FlatButton label="Mark" secondary onClick={this.markHighlighted} />
					</div>
					<div className="editor" onClick={this.focusEditor} role="button" tabIndex={0}>
						<Editor
							ref={(editor) => { this.editor = editor; }}
							editorState={editorState}
							onChange={this.onEditorChange}
						/>
					</div>
				</Paper>
				<RaisedButton
					label="Preview"
					fullWidth
					primary
					className="preview-button"
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
				<ChooseLanugage
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
				/>
			</div>
		);
	}
}

SuggestFillIn.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestFillIn;
