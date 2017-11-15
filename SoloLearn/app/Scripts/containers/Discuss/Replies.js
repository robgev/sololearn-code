// React modules
import React, { Component } from 'react';

// Additional components
import Reply from './Reply';

class Replies extends Component {
	renderReplies() {
		const { replies } = this.props;

		return replies.map(reply => (
			<Reply
				key={reply.id}
				reply={reply}
				votePost={this.props.votePost}
				remove={this.props.openDeletePopup}
				isUsersQuestion={this.props.isUsersQuestion}
			/>
		));
	}

	render() {
		return (
			<div id="replies">{this.renderReplies()}</div>
		);
	}
}

export default Replies;
