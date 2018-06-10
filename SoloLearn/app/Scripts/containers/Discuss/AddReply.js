// React modules
import React, { Component } from 'react';

// Material UI components
import { RaisedButton, Paper } from 'material-ui';

import MentionInput from 'components/Shared/MentionInput/MentionInput';

import { getMentionsList } from 'utils';

import { AddReplyStyles as styles } from './styles';

class AddReply extends Component {
	save = () => {
		this.props.save(this.input.popValue());
	}
	render() {
		return (
			<Paper
				id="add-reply"
				zDepth={5}
				style={styles.container}
			>
				<div style={styles.editor}>
					<MentionInput
						ref={(input) => { this.input = input; }}
						getUsers={getMentionsList('discuss', { postId: this.props.postId })}
						submit={this.props.save}
					/>
				</div>
				<div style={styles.editorActions}>
					<RaisedButton
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
