import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { toSeoFriendly } from 'utils';
import Post from './Post';

class PostPage extends Component {
	_isMounted;
	setRouteAlias = (alias) => {
		const { id, replyId = '' } = this.props.params;
		if (this._isMounted) {
			const query = this.props.location.search;
			browserHistory.replace(`/discuss/${id}/${toSeoFriendly(alias)}/${replyId}${query}`);
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
				key={`${id}-${replyId}`}
				id={parseInt(id, 10)}
				replyID={replyId ? parseInt(replyId, 10) : null}
				setRouteAlias={this.setRouteAlias}
			/>
		);
	}
}

export default PostPage;
