import React, { useState, useEffect, useRef } from 'react';
import { EditorState, Modifier, convertToRaw } from 'draft-js';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import hexToRgba from 'hex-to-rgba';
import { translate } from 'react-i18next';
import { Container, FlexBox, Link } from 'components/atoms';
import { RefLink } from 'components/molecules';
import { Entry } from 'components/organisms';

import { getMentionsList, makeEditableContent, getMentionsFromRawEditorContent } from 'utils';
import { getBackgroundStyle, getFontSize } from '../utils';
import { USER_POST_MAX_LENGTH } from '../UserPostEditor';

import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import './styles.scss';

const DraftEditor = ({
	background,
	measure,
	setEditorText = null,
	isEditorReadOnly = false,
	editorInitialText = '',
	t,
}) => {
	const [ editorState, setEditorState ] = useState(EditorState.createWithContent(makeEditableContent(editorInitialText)));
	const [ fontSize, setFontSize ] = useState(isEditorReadOnly && background.type === 'none' ? 15 : 30);
	const [ suggestions, setSuggestions ] = useState([]);
	const hasBackground = background && background.type !== 'none';
	const mentionPluginRef = useRef(createMentionPlugin({
		mentionComponent: ({ children, mention }) => (isEditorReadOnly
			? (
				<Link
					className="hoverable"
					style={{ color: hasBackground ? background.textColor : '#607D8B' }}
					to={`/profile/${mention.id}`}
				>
					{children}
				</Link>
			)
			: <b>{children}</b>),
	}));
	const linkifyPluginRef = useRef(createLinkifyPlugin({
		target: '_blank',
		component: ({ children, href }) => (
			<RefLink
				className={hasBackground ? 'underline' : null}
				style={{ color: hasBackground ? background.textColor : '#607D8B' }}
				to={href}
			>
				{children}
			</RefLink>
		),
	}));
	const emojiPlugin = useRef(createEmojiPlugin({ useNativeArt: true }));
	const { EmojiSuggestions, EmojiSelect } = emojiPlugin.current;

	const { MentionSuggestions } = mentionPluginRef.current;
	const plugins = isEditorReadOnly
		? [ mentionPluginRef.current, linkifyPluginRef.current ]
		: [ mentionPluginRef.current, emojiPlugin.current ];

	const getSuggestions = ({ value }) => {
		setSuggestions([]);
		const currentMentions =
			getMentionsFromRawEditorContent(convertToRaw(editorState.getCurrentContent()));
		const currentMentionIds = currentMentions.map(mention => mention.id);
		getMentionsList({ type: 'userPost' })(value)
			.then((users) => {
				const filteredSuggestions = users.filter(u => !currentMentionIds.includes(u.id));
				setSuggestions(filteredSuggestions.slice(0, 5));
			});
	};

	useEffect(() => {
		// setting the cursor position to the start in case of repost
		if (editorInitialText.startsWith('\n')) {
			const selectionBefore = editorState.getCurrentContent().getSelectionBefore();
			setEditorState(EditorState.acceptSelection(editorState, selectionBefore));
		}
	}, []);

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
		const currentContentLength = currentContent.getPlainText().length;
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

	const handleReturn = () => {
		const currentContent = editorState.getCurrentContent();
		const currentContentLength = currentContent.getPlainText().length;
		const selectedTextLength = _getLengthOfSelectedText();
		if (currentContentLength - selectedTextLength >= USER_POST_MAX_LENGTH) {
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
		if (!isEditorReadOnly) { setTimeout(focus, 0); }
	}, [ background ]);

	useEffect(() => {
		const currentContent = editorState.getCurrentContent();
		const text = currentContent.getPlainText();
		if (setEditorText) {
			setEditorText(currentContent);
		}
		const newLinesCount = (text.match(/\n/g) || []).length;
		if (!isEditorReadOnly) {
			setFontSize(getFontSize(text.length, newLinesCount));
		}
		measure();
	}, [ editorState ]);

	const getRgbaHexFromArgbHex = color => `#${color.substring(3, color.length)}${color.substring(1, 3)}`;

	const currentContentLength = editorState.getCurrentContent().getPlainText('').length;

	const filteredSuggestions = suggestions.filter(mention =>
		mention.name.length + currentContentLength <= USER_POST_MAX_LENGTH);

	return (
		<FlexBox
			align={background ? background.type !== 'none' && true : false}
			justify={background ? background.type !== 'none' && true : false}
			column
			style={background.type === 'none' ?
				{
					color: 'black',
					fontSize,
					cursor: isEditorReadOnly ? 'cursor' : 'text',
					minHeight: isEditorReadOnly ? 50 : 140,
					maxHeight: isEditorReadOnly ? '100%' : 250,
					overflow: isEditorReadOnly ? 'default' : 'auto',
				}
				:
				{
					...style,
					color: background ? background.textColor.length > 6 ? hexToRgba(getRgbaHexFromArgbHex(background.textColor)) : background.textColor : 'black',
					fontSize,
					cursor: isEditorReadOnly ? 'cursor' : 'text',
					height: 250,
				}
			}
			className={isEditorReadOnly ? 'draft-editor-container read-only' : 'draft-editor-container'}
			onClick={() => { editorRef.current.focus(); }}
		>
			<Container className={isEditorReadOnly && background.type === 'none' ? 'draft-editor-inner-container no-padding' : 'draft-editor-inner-container'}>
				<Editor
					editorState={editorState}
					stripPastedStyles
					handleBeforeInput={handeBeforeInput}
					handlePastedText={handlePastedText}
					handleReturn={handleReturn}
					onChange={editorState => setEditorState(editorState)}
					textAlignment={background ? background.type !== 'none' && 'center' : 'left'}
					ref={editorRef}
					placeholder={t('user_post.user-post-placeholder')}
					plugins={plugins}
					readOnly={isEditorReadOnly}
				/>
				<MentionSuggestions
					onSearchChange={getSuggestions}
					suggestions={filteredSuggestions}
					entryComponent={Entry}
				/>
			</Container>
			{!isEditorReadOnly &&
				<Container className="up-emojies-container">
					<EmojiSuggestions />
					<EmojiSelect />
				</Container>
			}
		</FlexBox>
	);
};

DraftEditor.defaultProps = {
	measure: () => { },
};

export default translate()(DraftEditor);
