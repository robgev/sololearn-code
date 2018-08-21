// React modules
import React, { Component } from 'react';

// Material UI components
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import MentionInput from 'components/MentionInput';

import { AddReplyStyles as styles } from './styles';
import './addReply.scss';

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
	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}
	save = () => {
		this.setState({ isReplyBoxOpen: false });
		this.props.save(this.mentionInput.popValue());
	}
	render() {
		const { isReplyBoxOpen, replyLength } = this.state;
		return (
			<Paper
				id="add-reply"
				className="add-reply"
				style={styles.container}
			>
				<div style={styles.editor}>
					<MentionInput
						ref={(input) => { this.mentionInput = input; }}
						onFocus={this.openReplyBox}
						onBlur={this.handleBlur}
						onLengthChange={this.onLengthChange}
						style={isReplyBoxOpen ? { height: 100 } : { height: 50 }}
						getUsers={{ type: 'discuss', params: { postId: this.props.postId } }}
						submit={this.props.save}
						placeholder={!isReplyBoxOpen && replyLength === 0 ? 'Write a new answer' : ''}
					/>
					<span style={styles.textFieldCoutner}>{2048 - replyLength} characters remaining</span>
				</div>
				<div style={styles.editorActions}>
					<RaisedButton
						disabled={replyLength > 2048 || replyLength === 0}
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
