import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observable, action, autorun } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import InfiniteScroll from 'components/InfiniteScroll';
import MentionInput from 'components/MentionInput';
import FlatButton from 'material-ui/FlatButton';
import CommentsAPI from './comments.api';
import CommentList from './CommentList';

import IComment from './IComment';
import CommentsToolbar from './CommentsToolbar';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

@connect(mapStateToProps)
@observer
class Comments extends Component {
	commentsAPI = new CommentsAPI({
		type: this.props.type,
		id: this.props.id,
		commentsType: this.props.commentsType,
		orderBy: 2,
	})

	commentsRefs = {};
	addRef = id => (node) => {
		this.commentsRefs[id] = node;
	}

	@observable orderBy = 2;

	@observable comments = []
	@observable commentsCount = this.props.commentsCount
	@observable hasMore = true;
	@observable initial = true;

	componentDidMount() {
		this.dispose = autorun(() => {
			// Need to keep commentsAPI orderBy in sync with view
			this.commentsAPI.orderBy = this.orderBy;
		});
		this.getCommentsBelow(3);
	}

	componentWillUnmount() {
		this.dispose();
	}

	@action changeOrder = (val) => {
		this.unlockInitial();
		this.orderBy = val;
		this.comments = [];
		this.hasMore = true;
	}

	@action unlockInitial = () => {
		this.initial = false;
	}

	loadMore = () => this.getCommentsBelow(); // need to ignore default "page" arg by InfinteScroll

	@action getCommentsBelow = async (count = 20) => {
		const comments = await this.commentsAPI.getComments({
			index: this.comments.length, count,
		});
		if (comments.length < count) {
			this.hasMore = false;
		}
		const withReplies = comments.map(comment =>
			new IComment({ ...comment, repliesArray: [] }));
		this.comments.push(...withReplies);
		this.comments = this.commentsAPI.orderComments(this.comments);
	}

	@action addComment = async () => {
		const {
			level, name, avatarUrl, badge, id,
		} = this.props.userProfile;
		const message = this.mentionInput.popValue();
		const { comment } = await this.commentsAPI.addComment({ message });
		const newComment = new IComment({
			replies: 0,
			vote: 0,
			message,
			votes: 0,
			repliesArray: [],
			parentID: null,
			id: comment.id,
			level,
			userName: name,
			userID: id,
			avatarUrl,
			badge,
			date: comment.date,
		});
		this.comments.push(newComment);
		this.comments = this.commentsAPI.orderComments(this.comments);
		this.commentsRefs[comment.id].getWrappedInstance().scrollIntoView();
	}

	@action deleteComment = (id) => {
		this.comments.splice(this.comments.findIndex(c => c.id === id), 1);
		this.commentsAPI.deleteComment({ id });
	}

	render() {
		return (
			<div>
				<DevTools />
				<CommentsToolbar value={this.orderBy} onChange={this.changeOrder} />
				<MentionInput
					ref={(i) => { this.mentionInput = i; }}
					getUsers={() => Promise.resolve([])}
				/>
				<FlatButton
					label="Comment"
					onClick={this.addComment}
				/>
				<CommentList
					commentsRef={this.addRef}
					delete={this.deleteComment}
					comments={this.comments}
					loadMore={this.loadMore}
					hasMore={this.hasMore && !this.initial}
					infinite
					commentsAPI={this.commentsAPI}
				/>
				{
					this.initial && this.comments.length > 0 && this.hasMore
					&& (
						<FlatButton
							label="Load more"
							onClick={this.unlockInitial}
						/>
					)
				}
			</div>
		);
	}
}

export default Comments;
