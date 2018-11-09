import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { LayoutWithSidebar } from 'components/molecules';
import Replies from './Replies';
import Question from './Question';
import PostSidebar from './PostSidebar';
import IPost from './IPost';

import './styles.scss';

@observer
@translate()
class Post extends Component {
	static defaultProps = {
		replyID: null,
	}

	post = new IPost({ id: this.props.id })

	componentDidMount() {
		this.post.getPost()
			.then((post) => {
				this.props.setRouteAlias(post.title);
			});
	}

	render() {
		const { id, replyID } = this.props;
		return (
			<LayoutWithSidebar
				sidebar={<PostSidebar />}
				className="discuss_post"
			>
				<Question
					post={this.post.data}
					onFollowClick={this.post.onFollow}
				/>
				<Replies
					postID={id}
					replyID={replyID}
					count={this.post.count}
				/>
			</LayoutWithSidebar>
		);
	}
}

export default Post;
