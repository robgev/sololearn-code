import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {
	Editor,
	EditorState,
	Modifier,
	CompositeDecorator,
	convertToRaw,
	ContentState,
	SelectionState,
} from 'draft-js';
import { PaperContainer, Container, Title, FlexBox, TextBlock } from 'components/atoms';
import { FlatButton } from 'components/molecules';
import LanguageSelectorTab from './LanguageSelectorTab';
import QuestionInput from './QuestionInput';
import PreviewButton from './PreviewButton';

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

const Marked = ({ children }) => <TextBlock className="marked">{children}</TextBlock>;

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

const getSlotNum = slot => parseInt(slot.slice(1, -1), 10);

const makeEditableContent = (answerText, answers) => {
	let contentState = ContentState.createFromText(answerText);
	const { blocks } = convertToRaw(contentState);
	const regex = /\{\d+}/g;
	blocks.forEach(({ key: currBlockKey, text: initBlockText }) => {
		const slots = initBlockText.match(regex) || [];
		slots.forEach((slot) => {
			const { text: blockText } = contentState.getBlockForKey(currBlockKey);
			const contentStateWithEntity = contentState.createEntity(
				'MARKED',
				'MUTABLE',
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const selectionState = SelectionState.createEmpty(currBlockKey).merge({
				anchorOffset: blockText.indexOf(slot),
				focusOffset: blockText.indexOf(slot) + slot.length,
			});
			contentState = Modifier.replaceText(
				contentStateWithEntity,
				selectionState,
				answers[getSlotNum(slot)].text,
				null,
				entityKey,
			);
		});
	});
	return contentState;
};

@translate()
class SuggestFillIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isMarkEnabled: false,
			language: null,
			question: props.t('factory.quiz-fill-in-the-blanks-question-title'),
			editorState: EditorState.createEmpty(new CompositeDecorator([
				{ strategy: markedStrategy, component: Marked },
			])),
		};
	}
	componentWillMount() {
		if (this.props.init !== null) {
			const { init } = this.props;
			const question = init.question.split(/\[!\w+!]/)[0];
			const answerText = init.question.split(/\[!\w+!]/)[1];
			this.setState({
				language: init.language,
				question,
				editorState: EditorState.createWithContent(makeEditableContent(
					answerText,
					init.answers,
				), new CompositeDecorator([
					{ strategy: markedStrategy, component: Marked },
				])),
			});
		}
	}
	selectLanguage = (language) => {
		this.setState({ language });
	}
	onQuestionChange = (e) => {
		this.setState({ question: e.target.value });
	}
	onEditorChange = (editorState) => {
		this.setState({ editorState, isMarkEnabled: this.hasSelection(editorState) });
	}
	focusEditor = () => {
		this.editor.focus();
	}
	hasSelection = (editorState) => {
		const selectionState = editorState.getSelection();
		const anchorKey = selectionState.getAnchorKey();
		const currentContent = editorState.getCurrentContent();
		const currentContentBlock = currentContent.getBlockForKey(anchorKey);
		const start = selectionState.getStartOffset();
		const end = selectionState.getEndOffset();
		const selectedText = currentContentBlock.getText().slice(start, end);
		return selectedText.trim().length !== 0;
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
	isComplete = () => {
		const { language, question } = this.state;
		return language !== null
			&& question.trim().length !== 0
			&& this.getEditorContent().blocks.some(block => block.entityRanges.length !== 0);
	}
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
			courseID: this.state.language.id,
			question: `${this.state.question.trim()}[!raw!]${question}`,
			type: 3,
		};
	}
	preview = () => {
		this.props.setPreview(this.makeQuiz());
	}
	render() {
		const {
			language, question, editorState, isMarkEnabled,
		} = this.state;
		const { t } = this.props;
		return (
			<Container className="fill-in">
				<LanguageSelectorTab language={language} selectLanguage={this.selectLanguage} />
				<QuestionInput question={question} onChange={this.onQuestionChange} />
				<PaperContainer className="container">
					<FlexBox justifyBetween>
						<Title className="title">{t('factory.quiz-fill-in-the-blanks-answer-title')}</Title>
						<FlatButton
							color="secondary"
							onClick={this.markHighlighted}
							disabled={!isMarkEnabled}
						>
							{t('factory.highlight')}
						</FlatButton>
					</FlexBox>
					<Container
						className="editor"
						onClick={this.focusEditor}
					>
						<Editor
							ref={(editor) => { this.editor = editor; }}
							onSelect={this.onEditorChange}
							editorState={editorState}
							onChange={this.onEditorChange}
							textDirection="LTR"
						/>
					</Container>
				</PaperContainer>
				<PreviewButton
					onClick={this.preview}
					disabled={!this.isComplete()}
				/>
			</Container>
		);
	}
}

SuggestFillIn.propTypes = {
	setPreview: PropTypes.func.isRequired,
};

export default SuggestFillIn;
