import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observable, action, autorun, computed } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import MentionInput from 'components/MentionInput';
import FlatButton from 'material-ui/FlatButton';

import CommentsAPI from './comments.api';
import CommentList from './CommentList';
import IComment from './IComment';
import CommentsToolbar from './CommentsToolbar';
import { filterExisting } from './comments.utils';
import './comments.scss';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

@withRouter
@connect(mapStateToProps)
@observer
class Comments extends Component {
	commentsAPI = new CommentsAPI({
		type: this.props.type,
		id: this.props.id,
		commentsType: this.props.commentsType,
		orderBy: 2,
		findPostId: this.props.location.query.commentID,
	})

	commentsRefs = {};
	addRef = id => (node) => {
		this.commentsRefs[id] = node;
	}

	@observable orderBy = 2;

	@observable comments = [];
	@observable commentsCount = this.props.commentsCount;
	@observable hasMore = true;
	@observable initial = true;

	@computed get hasMoreAbove() {
		return this.firstIndex > 0;
	}

	@computed get firstIndex() {
		// Created replies index is undefined, so skip over those
		for (let i = 0; i < this.comments.length; i += 1) {
			const { index } = this.comments[i];
			// Not your created comment
			if (index !== undefined) {
				return index;
			}
		}
		// All your created comments or not yet fetched
		return 0;
	}

	@computed get isOnReply() {
		return this.comments.length > 0 && this.comments[0].index === -1;
	}

	componentDidMount() {
		this.dispose = autorun(() => {
			// Need to keep commentsAPI orderBy in sync with view
			this.commentsAPI.orderBy = this.orderBy;
		});
		this.initialRequest();
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
	@action initialRequest = async () => {
		const { findPostId } = this.commentsAPI;
		const comments = await this.commentsAPI.getComments({
			index: this.comments.length, count: 3,
		});
		let withReplies;
		const isFindingReply = comments[0].index === -1;
		if (isFindingReply) {
			// FindPostId is a reply id, have to format the replies
			withReplies = [ new IComment({
				...comments[0],
				repliesArray: comments.slice(1).map(c => new IComment({ ...c, repliesArray: null })),
			}) ];
		} else {
			withReplies = comments.map(comment =>
				new IComment({ ...comment, repliesArray: [] }));
		}
		this.comments.push(...withReplies);
		if (isFindingReply) {
			this.highlight(this.comments[0].id, findPostId);
		} else {
			this.highlight(findPostId);
		}
		this.commentsAPI.findPostId = null;
	}

	// need to ignore default "page" arg by InfinteScroll, so can't pass getCommentsBelow
	loadMore = () => this.getCommentsBelow();

	@action reset = () => {
		this.comments = [];
		this.initial = false;
		this.hasMore = true;
	}

	@action getCommentsBelow = async () => {
		const count = 20;
		const comments = await this.commentsAPI.getComments({
			index: this.comments.length, count,
		});
		if (comments.length < count) {
			this.hasMore = false;
		}
		const filtered = filterExisting(this.comments, comments);
		const withReplies = filtered.map(comment =>
			new IComment({ ...comment, repliesArray: [] }));
		this.comments.push(...withReplies);
		this.comments = this.commentsAPI.orderComments(this.comments);
	}

	@action getCommentsAbove = async () => {
		const { firstIndex } = this;
		const index = firstIndex > 20 ? firstIndex - 20 : 0;
		const count = firstIndex - index;
		const comments = await this.commentsAPI.getComments({
			index, count,
		});
		const filtered = filterExisting(this.comments, comments);
		const withReplies = filtered.map(comment =>
			new IComment({ ...comment, repliesArray: [] }));
		this.comments.unshift(...withReplies);
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
		this.highlight(comment.id);
	}

	highlight = (id, replyId) => {
		if (id !== null) {
			this.commentsRefs[id].getWrappedInstance().scrollIntoView(replyId);
		}
	}

	// Soft delete in case of mod level 1 reporting, hides the comment but doesn't send delete req
	@action deleteComment = (id) => {
		this.comments.splice(this.comments.findIndex(c => c.id === id), 1);
		this.commentsAPI.deleteComment({ id });
	}

	render() {
		console.log(this.commentsCount, this.props.commentsCount);
		return (
			<div className="comments-container">
				<CommentsToolbar count={this.commentsCount} value={this.orderBy} onChange={this.changeOrder} />
				<MentionInput
					style={{ height: 50 }}
					placeholder="Write a new comment"
					ref={(i) => { this.mentionInput = i; }}
					getUsers={this.commentsAPI.getMentionUsers}
				/>
				<FlatButton
					label="Comment"
					onClick={this.addComment}
				/>
				{
					this.isOnReply &&
					<FlatButton label="Back" onClick={this.reset} />
				}
				{
					this.hasMoreAbove &&
					<FlatButton label="Load more" onClick={this.getCommentsAbove} />
				}
				<CommentList
					commentsRef={this.addRef}
					delete={this.deleteComment}
					comments={this.comments}
					loadMore={this.loadMore}
					hasMore={this.hasMore && !this.initial && !this.isOnReply}
					infinite
					commentsAPI={this.commentsAPI}
				/>
				{
					this.initial && this.comments.length > 0 && this.hasMore && !this.isOnReply
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
