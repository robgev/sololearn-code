import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { toSeoFriendly } from 'utils';
import Post from './Post';

class PostPage extends Component {
	_isMounted;
	setRouteAlias = (alias) => {
		const { id, replyId = '' } = this.props.params;
		if (this._isMounted) {
			browserHistory.replace(`/discuss/${id}/${toSeoFriendly(alias)}/${replyId}`);
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const { id, replyId } = this.props.params;
		return (
			<Post
				key={id}
				id={parseInt(id, 10)}
				replyID={parseInt(replyId, 10)}
				setRouteAlias={this.setRouteAlias}
			/>
		);
	}
}

export default PostPage;
