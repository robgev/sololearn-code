import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Post from './Post';

class PostPage extends Component {
	setRouteAlias = (alias) => {
		const { id, replyId = '' } = this.props.params;
		browserHistory.replace(`/discuss/${id}/${alias}/${replyId}`);
	}

	render() {
		const { id, replyId } = this.props.params;
		return (
			<Post
				key={id}
				id={id}
				replyID={replyId}
				setRouteAlias={this.setRouteAlias}
			/>
		);
	}
}

export default PostPage;
