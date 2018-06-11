// React modules
import React, { Component } from 'react';

// Material UI components
import { RaisedButton, Paper } from 'material-ui';

import MentionInput from 'components/Shared/MentionInput/MentionInput';

import { getMentionsList } from 'utils';

import { AddReplyStyles as styles } from './styles';

class AddReply extends Component {
	state = {
		isReplyBoxOpen: false,
		replyLength: 0,
	}
	openReplyBox = () => {
		this.setState({ isReplyBoxOpen: true });
	}
	closeReplyBox = () => {
		this.setState({ isReplyBoxOpen: false });
	}
	handleBlur = () => {
		if (this.state.replyLength <= 1) { this.closeReplyBox(); }
	}
	onLengthChange = () => {
		if (this.mentionInput) {
			this.setState({ replyLength: this.mentionInput.getLength() });
		}
	}
	save = () => {
		this.props.save(this.mentionInput.popValue());
	}
	render() {
		const { isReplyBoxOpen, replyLength } = this.state;
		return (
			<Paper
				id="add-reply"
				zDepth={5}
				style={styles.container}
			>
				<div style={styles.editor}>
					<MentionInput
						ref={(input) => { this.mentionInput = input; }}
						onFocus={this.openReplyBox}
						onBlur={this.handleBlur}
						onChange={this.onLengthChange}
						style={isReplyBoxOpen ? { height: 200 } : { height: 50 }}
						getUsers={getMentionsList('discuss', { postId: this.props.postId })}
						submit={this.props.save}
						placeholder={!isReplyBoxOpen && replyLength === 0 ? 'Write a new answer' : ''}
					/>
					<span style={styles.textFieldCoutner}>{2048 - replyLength} characters remaining</span>
				</div>
				<div style={styles.editorActions}>
					<RaisedButton
						disabled={replyLength > 2048}
						label="Save"
						primary
						onClick={this.save}
					/>
				</div>
			</Paper>
		);
	}
}

export default AddReply;
