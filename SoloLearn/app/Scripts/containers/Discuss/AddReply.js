// React modules
import React, { Component } from 'react';

// Material UI components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

const styles = {
	container: {
		zIndex: 5,
		position: 'fixed',
		width: 'inherit',
		bottom: 0,
		left: 'inherit',
		right: 'inherit',
		top: 'inherit',
		padding: '10px 20px',
		background: '#fff',
		boxSizing: 'border-box',
		boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 10px, rgba(0, 0, 0, 0.227451) 0px 3px 10px',
	},

	editor: {
		position: 'relative',
		padding: '0 0 10px 0',
	},

	textField: {
		margin: 0,
		fontSize: '13px',
	},

	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		fontWeight: '500',
	},

	editorActions: {
		textAlign: 'right',
		margin: '10px 0 0 0',
	},
};

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
