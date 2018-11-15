import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { changePostRepliesCount, removePostFromList, votePostInList } from 'actions/discuss';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { LayoutWithSidebar } from 'components/molecules';
import Replies from './Replies';
import Question from './Question';
import PostSidebar from './PostSidebar';
import IPost from './IPost';

import './styles.scss';

const mapDispatchToProps = {
	changePostRepliesCount,
	removePostFromList,
	votePostInList,
};

@connect(null, mapDispatchToProps)
@translate()
@observer
class Post extends Component {
	static defaultProps = {
		replyID: null,
	}

	post = new IPost({ id: this.props.id })

	handleDelete = () => {
		this.post.deletePost()
			.then(this.props.removePostFromList)
			.then(() => {
				browserHistory.replace('/discuss');
			});
	}

	handleVote = ({ vote, votes }) => {
		this.props.votePostInList({ id: this.post.id, vote, votes });
	}

	handlePostRepliesCountChange = (countChange) => {
		this.props.changePostRepliesCount({ id: this.post.id, countChange });
		this.post.changeCount(countChange);
	}

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
					onVote={this.handleVote}
					onDelete={this.handleDelete}
				/>
				{
					this.post.data !== null
					&& (
						<Replies
							key={replyID || 0}
							postID={id}
							askerID={this.post.data.userID}
							replyID={replyID}
							count={this.post.count}
							onCountChange={this.handlePostRepliesCountChange}
						/>
					)
				}
			</LayoutWithSidebar>
		);
	}
}

export default Post;
