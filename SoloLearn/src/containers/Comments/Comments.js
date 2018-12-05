import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observable, action, autorun, computed } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { CountingMentionInput } from 'components/organisms';
import { ProfileAvatar, FlatButton, InfiniteScroll } from 'components/molecules';
import { Container, PaperContainer } from 'components/atoms';
import CommentsAPI from './comments.api';
import IComment from './IComment';
import CommentsToolbar from './CommentsToolbar';
import { filterExisting } from './comments.utils';
import CommentList from './CommentList';

import './comments.scss';
import './CommentList.scss';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

@withRouter
@connect(mapStateToProps)
@translate()
@observer
class Comments extends Component {
	commentsAPI = new CommentsAPI({
		type: this.props.type,
		id: this.props.id,
		commentsType: this.props.commentsType,
		orderBy: 2,
		findPostId: parseInt(this.props.location.query.commentID, 10),
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
	@observable loading = false;
	@observable isSubmitEnabled = false;

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

	componentWillReceiveProps(nextProps) {
		const { commentsCount } = nextProps;
		if (commentsCount !== this.props.commentsCount) {
			this.updateCommentCount(commentsCount);
		}
	}

	componentWillUnmount() {
		this.dispose();
	}

	@action updateCommentCount = (commentsCount) => {
		this.commentsCount = commentsCount;
	}

	@action onCommentAdd = () => {
		this.commentsCount = this.commentsCount + 1;
	}

	@action onCommentDelete = (val = 1) => {
		this.commentsCount = this.commentsCount - val;
	}

	@action submitEnabledChange = (isSubmitEnabled) => {
		this.isSubmitEnabled = isSubmitEnabled;
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
	static DEFAULT_INITAL_COUNT = 3;
	@action initialRequest = async () => {
		const { findPostId } = this.commentsAPI;
		this.comments = [];
		const comments = await this.commentsAPI.getComments({
			index: this.comments.length, count: Comments.DEFAULT_INITAL_COUNT,
		});
		if (comments.length < Comments.DEFAULT_INITAL_COUNT) {
			this.hasMore = false;
		}
		let withReplies;
		const isFindingReply = comments.length > 0 && comments[0].index === -1;
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

	componentDidUpdate(prevProps) {
		const { commentID } = this.props.location.query;
		if (commentID !== prevProps.location.query.commentID) {
			this.commentsAPI.findPostId = commentID;
			this.initialRequest();
		}
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
		this.loading = true;
		const comments = await this.commentsAPI.getComments({
			index: this.comments.length, count,
		});
		this.loading = false;
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
		this.loading = true;
		const comments = await this.commentsAPI.getComments({
			index, count,
		});
		this.loading = false;
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
		this.onCommentAdd();
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
		if (id) {
			this.commentsRefs[id].getWrappedInstance().getWrappedInstance().scrollIntoView(replyId);
		}
	}

	@action onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.commentLength = replyLength;
		}
	}

	// Soft delete in case of mod level 1 reporting, hides the comment but doesn't send delete req
	@action deleteComment = (id) => {
		const index = this.comments.findIndex(c => c.id === id);
		const countToRemove = this.comments[index].replies + 1;
		this.comments.splice(index, 1);
		this.commentsAPI.deleteComment({ id });
		this.onCommentDelete(countToRemove);
	}

	render() {
		const { t, userProfile } = this.props;
		return (
			<InfiniteScroll
				initialLoad={false}
				loadMore={this.loadMore}
				hasMore={this.hasMore}
				isLoading={this.loading}
				className="comment-list"
			>
				<PaperContainer className="comments-container">
					<CommentsToolbar
						count={this.commentsCount}
						value={this.orderBy}
						onChange={this.changeOrder}
					/>
					<Container className="input-bar">
						<ProfileAvatar user={userProfile} />
						<CountingMentionInput
							ref={(i) => { this.mentionInput = i; }}
							onSubmitEnabledChange={this.submitEnabledChange}
							getUsers={this.commentsAPI.getMentionUsers}
							placeholder={t('comments.write-comment-placeholder')}
						/>
					</Container>
					<FlatButton
						onClick={this.addComment}
						disabled={!this.isSubmitEnabled}
					>
						Comment
					</FlatButton>
					{
						this.isOnReply &&
						<FlatButton onClick={this.reset} >
							{t('common.back-action-title')}
						</FlatButton>
					}
					{
						this.hasMoreAbove &&
						<FlatButton onClick={this.getCommentsAbove}>
							{t('common.loadMore')}
						</FlatButton>
					}
					<CommentList
						comments={this.comments}
						onCommentAdd={this.onCommentAdd}
						onCommentDelete={this.onCommentDelete}
						commentsRef={this.addRef}
						delete={this.deleteComment}
						commentsAPI={this.commentsAPI}
					/>
				</PaperContainer>
			</InfiniteScroll>

		);
	}
}

export default Comments;
