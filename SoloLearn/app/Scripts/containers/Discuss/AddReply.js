// React modules
import React, { Component } from 'react';

// Material UI components
import { TextField, RaisedButton, Paper } from 'material-ui';

import { AddReplyStyles as styles } from './styles';

class AddReply extends Component {
	state = {
		replyText: '',
		rows: 1,
	};

	// Control answer text change
	onChange = (e) => { this.setState({ replyText: e.target.value }); }

	onFocus = () => { if (!this.state.replyText.length) this.setState({ rows: 4 }); }

	onBlur = () => { if (!this.state.replyText.length) this.setState({ rows: 1 }); }

	save = () => {
		this.setState({ replyText: '', rows: 1 });
		this.props.save(this.state.replyText);
	}

	render() {
		const { replyText, rows } = this.state;
		const disabled = !replyText.length;

		return (
			<Paper
				id="add-reply"
				zDepth={5}
				style={styles.container}
			>
				<div style={styles.editor}>
					<TextField
						floatingLabelText="Write a new answer"
						multiLine
						maxLength="2048"
						rows={rows}
						fullWidth
						value={replyText}
						onChange={this.onChange}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						style={styles.textField}
					/>
					<span
						style={styles.textFieldCoutner}
					>
						{2048 - replyText.length} characters remaining
					</span>
				</div>
				<div style={styles.editorActions}>
					<RaisedButton
						label="Save"
						primary
						disabled={disabled}
						onClick={this.save}
					/>
				</div>
			</Paper>
		);
	}
}

export default AddReply;
