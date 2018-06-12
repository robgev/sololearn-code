import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin from 'draft-js-mention-plugin';
import { mentionUsers } from 'utils';
import 'draft-js-mention-plugin/lib/plugin.css';

import Entry from './Entry';
import getCurrentSelectedLength from './getCurrentSelectedLength';
import './editorStyles.scss';
import './mentionStyles.scss';

class MentionInput extends Component {
	constructor(props) {
		super(props);
		this.mentionPlugin = createMentionPlugin({
			mentionComponent: ({ children }) => <b>{children}</b>,
		});
		this.state = {
			editorState: EditorState.createEmpty(),
			suggestions: [],
		};
	}

	onChange = (editorState) => {
		this.setState({ editorState }, () => {
			this.props.onLengthChange(this.getLength());
		});
	};

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

	onSearchChange = (e) => {
		const { value } = e;
		this.props.getUsers(value)
			.then((users) => {
				const mentions = this.getMentions();
				if (mentions.length < 10) {
					const suggestions = users
						.filter(user => !mentions.some(mentioned => mentioned.id === user.id));
					this.setState({ suggestions });
				}
			});
	};

	getEditorContent = () => convertToRaw(this.state.editorState.getCurrentContent())

	getMentions = () => Object.values(this.getEditorContent().entityMap)
		.map(el => el.data.mention);

	getBlocks = () => this.getEditorContent().blocks

	focus = () => {
		this.editor.focus();
	};

	getLength = () => this.state.editorState.getCurrentContent().getPlainText().length

	popValue = () => {
		const blocks = this.getBlocks();
		const mentions = this.getMentions();
		const { result } = blocks.reduce((acc, curr) => {
			const { text, entityRanges } = curr;
			const mentionIndex = acc.mentionIndex + entityRanges.length;
			const lineMentions = mentions.slice(acc.mentionIndex, mentionIndex);
			return { result: acc.result + mentionUsers(text, lineMentions, entityRanges), mentionIndex };
		}, { result: '', mentionIndex: 0 });
		this.setState({ editorState: EditorState.createEmpty() });
		return result;
	}

	render() {
		const { MentionSuggestions } = this.mentionPlugin;
		const plugins = [ this.mentionPlugin ];

		return (
			<div
				className={`editor ${this.props.className}`}
				style={this.props.style}
				onClick={this.focus}
				role="button"
				tabIndex={0}
			>
				<Editor
					placeholder={this.props.placeholder}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
					editorState={this.state.editorState}
					onChange={this.onChange}
					plugins={plugins}
					ref={(element) => { this.editor = element; }}
					handleBeforeInput={this.handleBeforeInput}
					handlePastedText={this.handlePastedText}
				/>
				<MentionSuggestions
					onSearchChange={this.onSearchChange}
					suggestions={this.state.suggestions}
					entryComponent={Entry}
				/>
			</div>
		);
	}
}

MentionInput.defaultProps = {
	className: '',
	style: {},
	placeholder: '',
	maxLength: 2048,
	onFocus: () => { }, // noop
	onBlur: () => { }, // noop
	onLengthChange: () => { }, // noop
};

MentionInput.propTypes = {
	getUsers: PropTypes.func.isRequired,
	className: PropTypes.string,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onLengthChange: PropTypes.func,
	maxLength: PropTypes.number,
	placeholder: PropTypes.string,
	style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default MentionInput;
