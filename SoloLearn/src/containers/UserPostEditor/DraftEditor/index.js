import React, { useState, useEffect, useRef } from 'react';
import { EditorState, Modifier, convertToRaw } from 'draft-js';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import hexToRgba from 'hex-to-rgba';
import { translate } from 'react-i18next';
import { Container, FlexBox, Link } from 'components/atoms';
import { RefLink } from 'components/molecules';
import { Entry } from 'components/organisms';

import { getMentionsList, makeEditableContent, getMentionsFromRawEditorContent } from 'utils';
import { getBackgroundStyle, getFontSize } from '../utils';
import { USER_POST_MAX_LENGTH } from '../UserPostEditor';

import 'draft-js-linkify-plugin/lib/plugin.css';
import './styles.scss';

const readOnlyFontSizeWithoutBackground = 14;
const defaultFontSize = 24;

const DraftEditor = ({
	background,
	measure,
	setEditorText = null,
	isEditorReadOnly = false,
	editorInitialText = '',
	t,
	onEscape,
	// emojiPlugin = null,
}) => {
	const hasBackground = background && background.type !== 'none';
	const [ editorState, setEditorState ] = useState(EditorState.createWithContent(makeEditableContent(editorInitialText)));
	const [ fontSize, setFontSize ] = useState(isEditorReadOnly && background.type === 'none' ? readOnlyFontSizeWithoutBackground : defaultFontSize);
	const [ suggestions, setSuggestions ] = useState([]);
	const [ suggestionsOpened, setSuggestionsOpened ] = useState(false);
	const editorRef = useRef(null);
	const containerRef = useRef(null);
	const linkifyPluginRef = useRef(createLinkifyPlugin({
		target: '_blank',
		component: ({ children, href }) => (
			<RefLink
				className={hasBackground ? 'underline' : null}
				style={{ color: hasBackground ? background.textColor : '#607D8B', fontSize }}
				to={href}
			>
				{children}
			</RefLink>
		),
	}));
	const mentionPluginRef = useRef(createMentionPlugin({
		positionSuggestions: ({ decoratorRect }) => {
			const containerRect = containerRef.current.getBoundingClientRect();
			const baseStyles = {
				fontSize: 'initial',
				transform: 'scale(1)',
				transformOrigin: '1em 0%',
				transition: 'all 0.25s cubic-bezier(0.3, 1.2, 0.2, 1) 0s',
			};
			if (decoratorRect.left - containerRect.left > containerRect.width / 2) {
				return {
					...baseStyles,
					right: `${containerRect.right - decoratorRect.left - decoratorRect.width}px`,
				};
			}
			return {
				...baseStyles,
				left: `${decoratorRect.left - containerRect.left}px`,
			};
		},
		mentionComponent: ({ children, mention }) => (isEditorReadOnly
			? (
				<Link
					className="hoverable"
					style={{ color: hasBackground ? background.textColor : '#607D8B', fontSize }}
					to={`/profile/${mention.id}`}
				>
					{children}
				</Link>
			)
			: <b>{children}</b>),
	}));

	const { MentionSuggestions } = mentionPluginRef.current;
	const plugins = isEditorReadOnly
		? [ mentionPluginRef.current, linkifyPluginRef.current ]
		: [
			mentionPluginRef.current,
			// emojiPlugin.current,
		];

	const getSuggestions = ({ value }) => {
		setSuggestions([]);
		const currentMentions =
			getMentionsFromRawEditorContent(convertToRaw(editorState.getCurrentContent()));
		const currentMentionIds = currentMentions.map(mention => mention.id);
		getMentionsList({ type: 'userPost' })(value)
			.then((users) => {
				const currentContentLength = editorState.getCurrentContent().getPlainText('').length;

				const filteredSuggestions = users.filter(u =>
					u.name.length + currentContentLength <= USER_POST_MAX_LENGTH &&
					!currentMentionIds.includes(u.id));
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

	const handleEscape = () => {
		if (!suggestionsOpened) {
			onEscape();
		}
	};

	const getRgbaHexFromArgbHex = color => `#${color.substring(3, color.length)}${color.substring(1, 3)}`;

	return (
		<FlexBox
			align={background ? background.type !== 'none' && true : false}
			justify={background ? background.type !== 'none' && true : false}
			column
			style={background.type === 'none' ?
				{
					color: 'black',
					cursor: isEditorReadOnly ? 'cursor' : 'text',
					minHeight: isEditorReadOnly ? 50 : 140,
					maxHeight: isEditorReadOnly ? '100%' : 250,
					overflow: isEditorReadOnly ? 'default' : 'auto',
				}
				:
				{
					...style,
					color: background ? background.textColor.length > 6 ? hexToRgba(getRgbaHexFromArgbHex(background.textColor)) : background.textColor : 'black',
					cursor: isEditorReadOnly ? 'cursor' : 'text',
					height: 250,
				}
			}
			className={isEditorReadOnly ? 'draft-editor-container read-only' : 'draft-editor-container'}
			onClick={() => { editorRef.current.focus(); }}
			ref={containerRef}
		>
			<Container
				className={isEditorReadOnly && background.type === 'none' ? 'draft-editor-inner-container no-padding' : 'draft-editor-inner-container'}
				style={{ fontSize }}
			>
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
					onEscape={handleEscape}
					readOnly={isEditorReadOnly}
				/>
				<MentionSuggestions
					onSearchChange={getSuggestions}
					suggestions={suggestions}
					entryComponent={Entry}
					onOpen={() => setSuggestionsOpened(true)}
					onClose={() => setSuggestionsOpened(false)}
				/>
			</Container>
		</FlexBox>
	);
};

DraftEditor.defaultProps = {
	measure: () => { },
};

export default translate()(DraftEditor);
