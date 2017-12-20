// React modules
import React, { Component } from 'react';

// Material UI components
import { TextField, RaisedButton, Paper } from 'material-ui';

import { AddReplyStyles as styles } from './styles';

class AddReply extends Component {
	state = {
		textFieldValue: '',
		errorText: '',
	};

	// Control answer text change
	onChange = (e) => {
		if (e.target.value.length === 0) {
			this.setState({
				textFieldValue: e.target.value,
				errorText: 'This field is required',
			});
		} else {
			this.setState({
				textFieldValue: e.target.value,
				errorText: '',
			});
		}
	}

	save = () => {
		this.setState({ textFieldValue: '' });
		this.props.save(this.state.textFieldValue);
	}

	render() {
		const saveDisabled = this.state.errorText.length === 0;

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
						rowsMax={4}
						fullWidth
						defaultValue={this.state.textFieldValue}
						errorText={this.state.errorText}
						onChange={e => this.onChange(e)}
						style={styles.textField}
					/>
					<span
						style={styles.textFieldCoutner}
					>
						{2048 - this.state.textFieldValue.length} characters remaining
					</span>
				</div>
				<div style={styles.editorActions}>
					<RaisedButton
						label="Save"
						primary={saveDisabled}
						disabled={!saveDisabled}
						onClick={this.save}
					/>
				</div>
			</Paper>
		);
	}
}

export default AddReply;
