import React, { Component } from 'react';
import { connect } from 'react-redux';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import MentionInput from 'components/MentionInput';
import { replaceMention } from 'utils';
import CommentList from './CommentList';
import CommentView from './CommentView';

import IComment from './IComment';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

@connect(mapStateToProps, null, null, { withRef: true })
@observer
class Comment extends Component {
	@observable isReplyInputOpen = false;
	@observable isReplyLoading = false;
	@observable initText = null;
	@action toggleReplyBox = async ({ id, userID, userName }) => {
		if (this.props.toggleReplyBox) {
			// Reply case
			this.props.toggleReplyBox({ id, userID, userName });
		} else {
			this.isReplyInputOpen = !this.isReplyInputOpen;
			if (this.isReplyInputOpen) {
				if (id !== this.props.comment.id) {
					this.initText = `[user id="${userID}"]${userName}[/user]`;
				}
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
			this.getRepliesBelow();
		} else {
			c.repliesArray = [];
		}
	}
	selfDestruct = () => {
		this.props.delete(this.props.comment.id);
	}
	@action deleteReply = (id) => {
		const { comment } = this.props;
		comment.repliesArray.splice(comment.repliesArray.findIndex(i => i.id === id), 1);
		comment.replies -= 1;
		this.props.commentsAPI.deleteComment({ id });
	}
	scrollIntoView = (replyId = null) => {
		if (replyId === null) {
			this.commentRef.getWrappedInstance().scrollIntoView();
		} else {
			this.commentsRefs[replyId].getWrappedInstance().scrollIntoView();
		}
	}
	@action addReply = async () => {
		try {
			const message = this.mentionInput.popValue();
			this.isReplyInputOpen = false;
			this.isReplyLoading = true;
			await this.reply({ message });
			this.isReplyLoading = false;
		} catch (e) {
			this.isReplyLoading = false;
		}
	}
	@action getRepliesBelow = async () => {
		const { repliesArray, id } = this.props.comment;
		const newComments = await this.props.commentsAPI
			.getComments({ parentID: id, index: repliesArray.length });
		const { comment } = this.props;
		const replyIds = comment.repliesArray.map(rep => rep.id);
		const filtered = newComments.filter(com => !replyIds.includes(com.id));
		const nulledReplies = filtered.map(com => new IComment({ ...com, repliesArray: null }));
		comment.repliesArray.push(...nulledReplies);
		comment.repliesArray = this.props.commentsAPI.orderComments(comment.repliesArray);
	}
	@action vote = (vote) => {
		const { comment } = this.props;
		const newVote = comment.vote === vote ? 0 : vote;
		const oldVote = comment.vote;
		comment.votes += (newVote - oldVote);
		comment.vote = newVote;
		this.props.commentsAPI.voteComment({ id: comment.id, vote: comment.vote })
			.catch(() => {
				comment.vote = oldVote;
				comment.votes -= (newVote - oldVote);
			});
	}
	@action reply = async ({ message }) => {
		const { userProfile, commentsAPI } = this.props;
		const { comment: { id, date } } = await commentsAPI
			.addComment({ message, parentID: this.props.comment.id });
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
	@action editComment = ({ message, id }) => {
		this.props.comment.message = message;
		this.props.commentsAPI.editComment({ message, id });
	}
	getVotes = (voteType) => {
		const { dispatch, commentsAPI, comment } = this.props;
		return dispatch(commentsAPI.getVotesList({ id: comment.id, type: voteType }));
	}
	getUpvotes = () => this.getVotes('Likes');
	getDownvotes = () => this.getVotes('Downvotes');
	upvote = () => this.vote(1);
	downvote = () => this.vote(-1);
	render() {
		const { userProfile } = this.props;
		const {
			replies,
			repliesArray,
		} = this.props.comment;
		return (
			<div>
				<CommentView
					comment={this.props.comment}
					getUpvotes={this.getUpvotes}
					getDownvotes={this.getDownvotes}
					upvote={this.upvote}
					downvote={this.downvote}
					userProfile={userProfile}
					onRepliesButtonClick={this.onRepliesButtonClick}
					selfDestruct={this.selfDestruct}
					onReply={this.toggleReplyBox}
					ref={(node) => { this.commentRef = node; }}
				>
					{({ isEditing, message, toggleEdit, id }) => {
						return isEditing
							? (
								<div>
									<MentionInput
										ref={(i) => { this.editMentionInput = i; }}
										getUsers={() => Promise.resolve([])}
										initText={message}
									/>
									<FlatButton
										label="Edit"
										onClick={() => {
											this.editComment({ message: this.editMentionInput.popValue(), id });
											toggleEdit();
										}}
									/>
								</div>
							)
							: <p>{replaceMention(message)}</p>;
					}}
				</CommentView>
				<Divider />
				{
					repliesArray !== null && (
						<div style={{ marginLeft: 30 }}>
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
									label="Load more"
									onClick={this.getRepliesBelow}
								/>
							}
						</div>
					)
				}
				{
					this.isReplyInputOpen
					&& (
						<div>
							<MentionInput
								ref={(i) => { this.mentionInput = i; }}
								initText={this.initText}
								getUsers={() => Promise.resolve([])}
							/>
							<FlatButton label="Reply" onClick={this.addReply} />
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
