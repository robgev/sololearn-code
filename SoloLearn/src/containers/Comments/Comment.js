import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { action, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import Linkify from 'react-linkify';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import MentionInput from 'components/MentionInput';
import { replaceMention, showError, determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import MyAvatar from './MyAvatar';
import CommentList from './CommentList';
import CommentView from './CommentView';
import IComment from './IComment';
import { filterExisting } from './comments.utils';

const mapStateToProps = ({ userProfile }) => ({
	userProfile,
	accessLevel: determineAccessLevel(userProfile.accessLevel),
});

@connect(mapStateToProps, null, null, { withRef: true })
@translate(null, { withRef: true })
@observer
class Comment extends Component {
	@observable isReplyInputOpen = false;
	@observable isReplyLoading = false;
	@observable initText = null;
	@observable editCommentLength = 0;
	@observable replyCommentLength = 0;
	@action toggleReplyBox = async ({ id, userID, userName }) => {
		if (this.props.toggleReplyBox) {
			// Reply case
			this.props.toggleReplyBox({ id, userID, userName });
		} else {
			this.isReplyInputOpen = !this.isReplyInputOpen;
			if (this.isReplyInputOpen) {
				this.initText = `[user id="${userID}"]${userName}[/user]`;
				setTimeout(() => {
					if (this.mentionInput) {
						this.mentionInput.focus();
					}
				}, 150);
			} else {
				this.initText = null;
			}
		}
	}
	commentsRefs = {};
	addReplyRef = id => (node) => {
		this.commentsRefs[id] = node;
	}
	onRepliesButtonClick = () => {
		const c = this.props.comment;
		if (c.repliesArray.length === 0) {
			return this.getRepliesBelow();
		}
		c.repliesArray = [];
		return Promise.resolve();
	}
	selfDestruct = () => {
		this.props.delete(this.props.comment.id);
	}

	onRequestRemoval = () => {
		const { id } = this.props.comment;
		const itemType = ReportItemTypes[`${this.props.commentsAPI.commentsType}Comment`];
		this.props.commentsAPI.requestRemoval({ itemId: id, itemType });
	}

	@computed get firstIndex() {
		const { repliesArray } = this.props.comment;
		if (repliesArray !== null) {
			// Created replies index is undefined, so skip over those
			for (let i = 0; i < repliesArray.length; i += 1) {
				const { index } = repliesArray[i];
				// Not your created comment
				if (index !== undefined) {
					return index;
				}
			}
			// All your created comments or not yet fetched
		}
		return 0;
	}

	@computed get hasRepliesAbove() {
		return this.firstIndex > 0;
	}

	@action deleteReply = async (id) => {
		const { comment } = this.props;
		comment.repliesArray.splice(comment.repliesArray.findIndex(i => i.id === id), 1);
		comment.replies -= 1;
		this.props.commentsAPI.deleteComment({ id })
			.catch(e => showError(e, 'Something went wrong when trying to delete comment'));
		this.props.onCommentDelete();
	}

	scrollIntoView = (replyId = null) => {
		if (replyId === null) {
			this.commentRef.getWrappedInstance().scrollIntoView();
		} else {
			this.commentsRefs[replyId].getWrappedInstance().getWrappedInstance().scrollIntoView();
		}
	}

	@action onReplyBlur = () => {
		if (this.mentionInput.getValue().length === 0) {
			const { id, userID, userName } = this.props;
			this.toggleReplyBox({ id, userID, userName });
		}
	}

	@action addReply = async () => {
		try {
			const message = this.mentionInput.popValue();
			this.isReplyInputOpen = false;
			this.isReplyLoading = true;
			await this.reply({ message });
			this.isReplyLoading = false;
			this.props.onCommentAdd();
		} catch (e) {
			this.isReplyLoading = false;
			showError(e, 'Something went wrong when trying to reply');
		}
	}

	@action getRepliesBelow = async () => {
		try {
			const { repliesArray, id } = this.props.comment;
			const newComments = await this.props.commentsAPI
				.getComments({ parentID: id, index: repliesArray.length });
			const { comment } = this.props;
			const filtered = filterExisting(comment.repliesArray, newComments);
			const nulledReplies = filtered.map(c => new IComment({ ...c, repliesArray: null }));
			comment.repliesArray.push(...nulledReplies);
			// Replies always sort by date
			comment.repliesArray = this.props.commentsAPI
				.orderComments(comment.repliesArray, 1).reverse();
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch comments');
		}
	}

	@action getRepliesAbove = async () => {
		try {
			const { firstIndex } = this;
			const index = firstIndex > 20 ? firstIndex - 20 : 0;
			const count = firstIndex - index;
			const comments = await this.props.commentsAPI.getComments({
				index, count, parentID: this.props.comment.id,
			});
			const { comment } = this.props;
			const filtered = filterExisting(comment.repliesArray, comments);
			const nulledReplies = filtered.map(c => new IComment({ ...c, repliesArray: null }));
			comment.repliesArray.unshift(...nulledReplies);
			comment.repliesArray = this.props.commentsAPI.orderComments(comment.repliesArray);
		} catch (e) {
			showError(e, 'Something went wrong when trying to fetch comments');
		}
	}

	@action vote = (vote) => {
		const { comment } = this.props;
		const newVote = comment.vote === vote ? 0 : vote;
		const oldVote = comment.vote;
		comment.votes += (newVote - oldVote);
		comment.vote = newVote;
		this.props.commentsAPI.voteComment({ id: comment.id, vote: comment.vote })
			.catch((e) => {
				comment.vote = oldVote;
				comment.votes -= (newVote - oldVote);
				showError(e, 'Something went wrong when trying to vote');
			});
	}

	@action reply = async ({ message }) => {
		const { userProfile, commentsAPI } = this.props;
		const res = await commentsAPI
			.addComment({ message, parentID: this.props.comment.id });
		if (res && res.error) {
			showError(res.error.data);
		}
		const { comment: { id, date } } = res;
		const newComment = new IComment({
			replies: 0,
			vote: 0,
			message,
			votes: 0,
			repliesArray: [],
			parentID: this.props.comment.id,
			id,
			isForced: true,
			level: userProfile.level,
			userName: userProfile.name,
			userID: userProfile.id,
			avatarUrl: userProfile.avatarUrl,
			badge: userProfile.badge,
			date,
		});
		const { comment } = this.props;
		comment.repliesArray.push(newComment);
		comment.replies += 1;
		comment.repliesArray = this.props.commentsAPI.orderComments(comment.repliesArray);
		this.scrollIntoView(id);
	}

	@action editComment = async ({ message, id }) => {
		this.props.comment.message = message;
		this.props.commentsAPI.editComment({ message, id })
			.catch(e => showError(e, 'Something went wrong when trying to edit comment'));
	}

	@action handleEditLengthChange = (length) => {
		this.editCommentLength = length;
	}

	@action handleReplyLengthChange = (length) => {
		this.replyCommentLength = length;
	}

	upvote = () => this.vote(1);
	downvote = () => this.vote(-1);

	render() {
		const { t, userProfile, accessLevel } = this.props;
		const {
			replies,
			repliesArray,
		} = this.props.comment;
		return (
			<div>
				<CommentView
					commentsType={this.props.commentsAPI.commentsType}
					accessLevel={accessLevel}
					comment={this.props.comment}
					upvote={this.upvote}
					downvote={this.downvote}
					userProfile={userProfile}
					onRepliesButtonClick={this.onRepliesButtonClick}
					selfDestruct={this.selfDestruct}
					onReply={this.toggleReplyBox}
					onRequestRemoval={this.onRequestRemoval}
					ref={(node) => { this.commentRef = node; }}
				>
					{({
						isEditing, message, toggleEdit, id,
					}) => (isEditing
						? (
							<div className="comment-input-toolbar">
								<div className="input-bar reply-input">
									<MyAvatar />
									<MentionInput
										style={{ height: 50 }}
										ref={(i) => { this.editMentionInput = i; }}
										getUsers={this.props.commentsAPI.getMentionUsers}
										initText={message}
										onLengthChange={this.handleEditLengthChange}
										placeholder={t('comments.write-comment-placeholder')}
									/>
								</div>
								<FlatButton
									label={t('common.edit-action-title')}
									disabled={!this.editCommentLength}
									onClick={() => {
										this.editComment({ message: this.editMentionInput.popValue(), id });
										toggleEdit();
									}}
								/>
							</div>
						)
						: (
							<Linkify>
								<p>{replaceMention(message)}</p>
							</Linkify>
						))}
				</CommentView>
				{
					repliesArray !== null && (
						<div style={{ marginLeft: 30 }}>
							{
								this.hasRepliesAbove &&
								<FlatButton label={t('common.loadMore')} onClick={this.getRepliesAbove} />
							}
							<CommentList
								comments={repliesArray}
								delete={this.deleteReply}
								commentsRef={this.addReplyRef}
								commentsAPI={this.props.commentsAPI}
								toggleReplyBox={this.toggleReplyBox}
							/>
							{
								repliesArray.length > 0 && repliesArray.length < replies &&
								<FlatButton
									label={t('common.loadMore')}
									onClick={this.getRepliesBelow}
								/>
							}
						</div>
					)
				}
				{
					this.isReplyInputOpen
					&& (
						<div className="comment-input-toolbar">
							<div className="input-bar reply-input">
								<MyAvatar />
								<MentionInput
									onBlur={this.onReplyBlur}
									style={{ height: 50 }}
									ref={(i) => { this.mentionInput = i; }}
									initText={this.initText}
									getUsers={this.props.commentsAPI.getMentionUsers}
									onLengthChange={this.handleReplyLengthChange}
									placeholder={t('comments.write-comment-placeholder')}
								/>
							</div>
							<FlatButton
								className="save-button"
								disabled={!this.replyCommentLength}
								label={t('comments.reply')}
								onClick={this.addReply}
							/>
							<Divider />
						</div>
					)
				}
				{
					this.isReplyLoading
					&& <CircularProgress style={{ display: 'flex', alignItems: 'center', margin: 'auto' }} />
				}
			</div>
		);
	}
}

export default Comment;
