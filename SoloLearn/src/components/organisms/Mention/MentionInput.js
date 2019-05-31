import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState, SelectionState, Modifier } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import { mentionUsers, getMentionsList } from 'utils';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import { Container } from 'components/atoms';
import Entry from './Entry';
import getCurrentSelectedLength from './getCurrentSelectedLength';
import './editorStyles.scss';
import './mentionStyles.scss';

const makeEditableContent = (text) => {
	const allMentionsRegex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/g;
	const singleMentionRegex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/;
	let contentState = ContentState.createFromText(text);
	const { blocks } = convertToRaw(contentState);
	blocks.forEach(({ key: currBlockKey, text: initBlockText }) => {
		const slots = initBlockText.match(allMentionsRegex) || [];
		slots.forEach((slot) => {
			// as current block text can change we need to get it each time
			const { text: blockText } = contentState.getBlockForKey(currBlockKey);
			const [ , id, name ] = slot.match(singleMentionRegex);
			const contentStateWithEntity = contentState.createEntity(
				'mention',
				'SEGMENTED',
				{ mention: { id, name } },
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const selectionState = SelectionState.createEmpty(currBlockKey).merge({
				anchorOffset: blockText.indexOf(slot),
				focusOffset: blockText.indexOf(slot) + slot.length,
			});
			contentState = Modifier.replaceText(
				contentStateWithEntity,
				selectionState,
				name,
				null,
				entityKey,
			);
		});
	});
	return contentState;
};

class MentionInput extends Component {
	constructor(props) {
		super(props);
		this.mentionPlugin = createMentionPlugin({
			mentionComponent: ({ children }) => <b>{children}</b>,
		});
		this.isFocused = false;
		this.isFocusForced = false;
		this.state = {
			editorState: props.initText !== null
				? EditorState.createWithContent(makeEditableContent(props.initText))
				: EditorState.createEmpty(),
			suggestions: [],
		};
	}

	componentDidMount() {
		if (this.props.autofocus) {
			setTimeout(this.editor.focus, 0);
		}
	}

	onChange = (editorState) => {
		this.setState({ editorState }, () => {
			this.props.onLengthChange(this.getLength(), this.getTrimmedLength());
		});
	};

	handleReturn = () => {
		if (this.getLength() > this.props.maxLength - 1) {
			return 'handled';
		}
		return 'not_handled';
	}

	handleBeforeInput = () => {
		const currentContent = this.state.editorState.getCurrentContent();
		const currentContentLength = currentContent.getPlainText('').length;
		const selectedTextLength = getCurrentSelectedLength(this.state.editorState);
		if (currentContentLength - selectedTextLength > this.props.maxLength - 1) {
			return 'handled';
		}
		return 'not_handled';
	}

	handlePastedText = (pastedText) => {
		const currentContent = this.state.editorState.getCurrentContent();
		const currentContentLength = currentContent.getPlainText('').length;
		const selectedTextLength = getCurrentSelectedLength(this.state.editorState);
		if ((currentContentLength + pastedText.length) - selectedTextLength > this.props.maxLength) {
			return 'handled';
		}
		return 'not_handled';
	}

	get getUsers() {
		return getMentionsList(this.props.getUsers);
	}

	onSearchChange = (e) => {
		const { value } = e;
		const getUsersId = this.getUsers(value);
		this.getUsersPromiseId = getUsersId;
		getUsersId
			.then((users) => {
				if (this.getUsersPromiseId === getUsersId) {
					const mentions = this.getMentions();
					if (mentions.length < 10) {
						const suggestions = users
							.filter(user => !mentions.some(mentioned => mentioned.id === user.id));
						this.setState({ suggestions });
					}
				}
			});
	};

	getEditorContent = () => convertToRaw(this.state.editorState.getCurrentContent())

	getMentions = () => Object.values(this.getEditorContent().entityMap)
		.map(el => el.data.mention);

	getBlocks = () => this.getEditorContent().blocks

	focus = (options) => {
		this.editor.focus(options);
	};

	blur = () => {
		this.editor.blur();
	}

	getText = () => this.state.editorState.getCurrentContent().getPlainText()

	getLength = () => this.getText().length

	getTrimmedLength = () => this.getText().trim().length

	popValue = () => {
		const value = this.getValue();
		this.setState({ editorState: EditorState.createEmpty() });
		return value;
	}

	getValue = () => {
		const blocks = this.getBlocks();
		const mentions = this.getMentions();
		const { result } = blocks.reduce((acc, curr) => {
			const { text, entityRanges } = curr;
			const mentionIndex = acc.mentionIndex + entityRanges.length;
			const lineMentions = mentions.slice(acc.mentionIndex, mentionIndex);
			return { result: `${acc.result}${mentionUsers(text, lineMentions, entityRanges)}\n`, mentionIndex };
		}, { result: '', mentionIndex: 0 });
		return result.trim();
	}

	// Call this when a click outside of the editor needs to focus it
	forceFocus = (options) => {
		if (this.isFocused) {
			this.isFocusForced = true;
		}
		setTimeout(() => {
			this.focus(options);
		}, 0);
		this.onFocus();
	}

	onFocus = () => {
		this.isFocused = true;
		this.props.onFocus();
	}

	onBlur = () => {
		if (this.isFocusForced) {
			this.isFocusForced = false;
			setTimeout(() => {
				this.focus();
			}, 0);
		} else {
			this.isFocused = false;
			this.props.onBlur();
		}
	}

	render() {
		const { MentionSuggestions } = this.mentionPlugin;
		const plugins = [ this.mentionPlugin ];

		const lengthConformingSuggestions = this.state.suggestions.filter(s =>
			this.getText().length + s.name.length <= this.props.maxLength);

		return (
			<Container
				className={`editor ${this.props.className}`}
				style={this.props.style}
				onClick={this.focus}
				role="button"
				tabIndex={0}
			>
				<Editor
					placeholder={this.props.placeholder}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					editorState={this.state.editorState}
					onChange={this.onChange}
					plugins={plugins}
					ref={(element) => { this.editor = element; }}
					handleBeforeInput={this.handleBeforeInput}
					handlePastedText={this.handlePastedText}
					handleReturn={this.handleReturn}
				/>
				<MentionSuggestions
					onSearchChange={this.onSearchChange}
					suggestions={lengthConformingSuggestions}
					entryComponent={Entry}
				/>
			</Container>
		);
	}
}

MentionInput.defaultProps = {
	className: '',
	style: {},
	placeholder: '',
	maxLength: 2048,
	initText: null,
	onFocus: () => { }, // noop
	onBlur: () => { }, // noop
	onLengthChange: () => { }, // noop
};

MentionInput.propTypes = {
	getUsers: PropTypes.shape({
		type: PropTypes.string.isRequired,
		params: PropTypes.object,
	}).isRequired,
	className: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	initText: PropTypes.string,
	onLengthChange: PropTypes.func,
	maxLength: PropTypes.number,
	placeholder: PropTypes.string,
	style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default MentionInput;
