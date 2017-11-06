// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

// Material UI components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
	container: {
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
	constructor(props) {
		super(props);

		this.state = {
			textFieldValue: '',
			errorText: '',
		};

		this.height = 0;
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	// Controll answer text change
	onChange(e) {
		if (e.target.value.length == 0) {
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

	// Detect enter on input
	handleKeyUp(e) {
		const addReply = document.getElementById('add-reply');
		const height = addReply.clientHeight;

		if (this.height != height) {
			this.height = height;
			console.log('resized!!!');
			this.props.updateDimensions();
		}
	}

	render() {
		const saveDisabled = this.state.errorText.length == 0;

		return (
			<div id="add-reply" style={styles.container}>
				<div className="editor" style={styles.editor}>
					<TextField
						floatingLabelText="Write a new answer"
						multiLine
						maxLength="2048"
						rowsMax={4}
						fullWidth
						defaultValue={this.state.textFieldValue}
						errorText={this.state.errorText}
						onChange={e => this.onChange(e)}
						onKeyUp={e => this.handleKeyUp(e)}
						style={styles.textField}
					/>
					<span style={styles.textFieldCoutner}>{2048 - this.state.textFieldValue.length} characters remaining</span>
				</div>

				<div style={styles.editorActions}>
					<RaisedButton label="Save" primary={saveDisabled} disabled={!saveDisabled} onClick={this.save} />
				</div>
			</div>
		);
	}

	componentDidMount() {
		this.height = document.getElementById('add-reply').clientHeight;
	}
}

export default AddReply;
