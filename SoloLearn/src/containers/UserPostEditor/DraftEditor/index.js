import React, { useState, useEffect, useRef } from 'react';
import { EditorState, Modifier } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import { getMentionsList } from 'utils';
import hexToRgba from 'hex-to-rgba';
import { Container, FlexBox } from 'components/atoms';
import { Entry } from 'components/organisms';
import { getBackgroundStyle, getFontSize } from '../utils';
import { USER_POST_MAX_LENGTH } from '../UserPostEditor';

import './styles.scss';

const DraftEditor = ({
	background,
	setEditorText,
}) => {
	const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
	const [ fontSize, setFontSize ] = useState(36);
	const [ suggestions, setSuggestions ] = useState([]);
	const mentionPluginRef = useRef(createMentionPlugin({
		mentionComponent: ({ children }) => <b>{children}</b>,
	}));
	const { MentionSuggestions } = mentionPluginRef.current;
	const plugins = [ mentionPluginRef.current ];

	const getSuggestions = ({ value }) => {
		getMentionsList({ type: 'userPost' })(value)
			.then((users) => {
				setSuggestions(users.slice(0, 5));
			});
	};

	const editorRef = useRef(null);

	const _getLengthOfSelectedText = () => {
		const currentSelection = editorState.getSelection();
		const isCollapsed = currentSelection.isCollapsed();

		let length = 0;

		if (!isCollapsed) {
			const currentContent = editorState.getCurrentContent();
			const startKey = currentSelection.getStartKey();
			const endKey = currentSelection.getEndKey();
			const startBlock = currentContent.getBlockForKey(startKey);
			const isStartAndEndBlockAreTheSame = startKey === endKey;
			const startBlockTextLength = startBlock.getLength();
			const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
			const endSelectedTextLength = currentSelection.getEndOffset();
			const keyAfterEnd = currentContent.getKeyAfter(endKey);
			if (isStartAndEndBlockAreTheSame) {
				length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
			} else {
				let currentKey = startKey;

				while (currentKey && currentKey !== keyAfterEnd) {
					if (currentKey === startKey) {
						length += startSelectedTextLength + 1;
					} else if (currentKey === endKey) {
						length += endSelectedTextLength;
					} else {
						length += currentContent.getBlockForKey(currentKey).getLength() + 1;
					}

					currentKey = currentContent.getKeyAfter(currentKey);
				}
			}
		}
		return length;
	};

	const handeBeforeInput = (_, editorState) => {
		const selectedTextLength = _getLengthOfSelectedText();
		if (editorState.getCurrentContent().getPlainText().length - selectedTextLength
			>= USER_POST_MAX_LENGTH) {
			return 'handled';
		}
		return 'not_handled';
	};

	const handlePastedText = (pastedText) => {
		const currentContent = editorState.getCurrentContent();
		const currentContentLength = currentContent.getPlainText('').length;
		const selection = editorState.getSelection();
		const selectedTextLength = _getLengthOfSelectedText();
		let nextEditorState = EditorState.createEmpty();
		if (currentContentLength + pastedText.length >= USER_POST_MAX_LENGTH + selectedTextLength) {
			const nextContentState = Modifier.replaceText(
				currentContent,
				selection,
				pastedText.slice(0, USER_POST_MAX_LENGTH + selectedTextLength - currentContentLength),
			);
			nextEditorState = EditorState.push(
				editorState,
				nextContentState,
				'insert-characters',
			);
			setEditorState(nextEditorState);
			return 'handled';
		}
		return 'not_handled';
	};

	const style = background === null
		? {}
		: getBackgroundStyle(background, { isPreview: false });

	const focus = () => {
		editorRef.current.focus();
	};

	useEffect(() => {
		setTimeout(focus, 0);
	}, [ background ]);

	useEffect(() => {
		const currentContent = editorState.getCurrentContent();
		const text = currentContent.getPlainText();
		setEditorText(text);
		const newLinesCount = (text.match(/\n/g) || []).length;
		setFontSize(getFontSize(text.length, newLinesCount));
	}, [ editorState ]);

	const getRgbaHexFromArgbHex = color => `#${color.substring(3, color.length)}${color.substring(1, 3)}`;

	return (
		<FlexBox
			align={background ? background.type !== 'none' && true : false}
			justify={background ? background.type !== 'none' && true : false}
			style={background.type !== 'none' ?
				{ ...style, color: background ? background.textColor.length > 6 ? hexToRgba(getRgbaHexFromArgbHex(background.textColor)) : background.textColor : 'black', fontSize }
				:
				{ color: 'black', fontSize }
			}
			className="draft-editor-container"
			onClick={() => { editorRef.current.focus(); }}
		>
			<Container className="draft-editor-inner-container">
				<Editor
					editorState={editorState}
					stripPastedStyles
					handleBeforeInput={handeBeforeInput}
					handlePastedText={handlePastedText}
					onChange={editorState => setEditorState(editorState)}
					textAlignment={background ? background.type !== 'none' && 'center' : 'left'}
					ref={editorRef}
					placeholder={background.type === 'none' ? 'Share coding tips, articles, snippets and anything code-related' : ''}
					plugins={plugins}
				/>
				<MentionSuggestions
					onSearchChange={getSuggestions}
					suggestions={suggestions}
					entryComponent={Entry}
				/>
			</Container>
		</FlexBox>
	);
};

export default DraftEditor;
