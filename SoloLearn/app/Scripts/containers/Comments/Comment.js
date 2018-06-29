// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Material UI components
import { TextField, IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import Linkify from 'react-linkify';

// Redux modules
import { getLikesAndDownvotesInternal } from 'actions/likes';

// Utils
import VoteControls from 'components/Shared/VoteControls';
import { updateDate, replaceMention, generatePreviews, getMentionFetcher } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import PreviewItem from 'components/Shared/PreviewItem';
import MentionInput from 'components/Shared/MentionInput';
import { loadRepliesTypes } from './Comments';

// Style
import { CommentStyle as styles } from './styles';

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	getLikes: getLikesAndDownvotesInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
class Comment extends Component {
	state = {
		// textFieldValue: this.props.comment.message,
		isReplyOpen: false,
		replyLength: this.props.comment.message.length,
	};

	openCloseReplies = () => {
		const { comment } = this.props;
		const willLoadReplies = comment.repliesArray && comment.repliesArray.length === 0;
		const type = willLoadReplies ? loadRepliesTypes.LOAD_REPLIES : loadRepliesTypes.CLOSE_REPLIES;
		this.props.loadReplies(comment.parentID || comment.id, type);
	}

	// TODO: IMPORTANT:
	// Move this function to Comments.js, do this stuff inside InfiniteVirtualizedList's
	// One item rendering function. This way we can conditionally render comments
	// And avoid unnecessary checks on all the items of the comment
	// E.G AvatarURL, getEditableArea and unnecessary load button.
	loadMore = () => {
		const { comment } = this.props;
		if (comment.loadAbove) {
			this.props.loadCommentsAbove(comment.parentId);
		} else {
			this.props.loadReplies(comment.parentId || comment.id, loadRepliesTypes.LOAD_REPLIES);
		}
	}

	getPrimaryControls = (comment) => {
		const isReply = comment.parentID != null;
		const hasReplies = !!comment.replies;
		const { t } = this.props;
		return (
			<div style={styles.commentControls.right}>
				{!isReply &&
					<FlatButton
						label={`${comment.replies} ${comment.replies === 1 ? t('comments.reply') : t('comments.replies-other')}`}
						primary={hasReplies}
						disabled={!hasReplies || comment.index === -1}
						onClick={this.openCloseReplies}
					/>}
				<FlatButton
					label={t('comments.reply')}
					primary
					onClick={() =>
						this.props.openReplyBoxToolbar(comment.id, comment.parentID, comment.userName, isReply)}
				/>
			</div>
		);
	}

	openEdit = () => {
		const { comment } = this.props;
		this.props.openEdit(
			comment.id, comment.parentID, comment.userName,
			() => setTimeout(() => this.mentionInput.focus(), 200),
		);
	}

	closeEdit = () => {
		this.props.cancelAll();
	}

	getVotes = () => {
		const { comment, commentType, getLikes } = this.props;
		getLikes(`${commentType}CommentLikes`, comment.id);
	}

	getDownvotes = () => {
		const { comment, commentType, getLikes } = this.props;
		getLikes(`${commentType}CommentDownvotes`, comment.id);
	}

	openReply = () => {
		this.setState({ isReplyOpen: true });
	}
	closeReply = () => {
		this.setState({ isReplyOpen: false });
	}
	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}

	getEditControls = () => {
		const { t } = this.props;
		return (
			<div className="edit-controls" style={styles.commentControls.right}>
				<FlatButton
					label={t('common.cancel-title')}
					onClick={this.closeEdit}
				/>
				<FlatButton
					label={t('common.save-action-title')}
					primary
					disabled={this.state.replyLength === 0}
					onClick={() => this.props.editComment(this.props.comment, this.mentionInput.popValue())}
				/>
			</div>
		);
	}

	getMenuControls = (comment) => {
		const {
			t,
			accessLevel,
			commentType,
			toggleReportPopup,
			toggleRemovalPopup,
		} = this.props;
		return (
			<IconMenu
				iconButtonElement={<IconButton style={styles.iconMenu.icon}><MoreVertIcon /></IconButton>}
				anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
				targetOrigin={{ horizontal: 'right', vertical: 'top' }}
			>
				{comment.userID === this.props.userId &&
					[
						<MenuItem
							primaryText={t('common.edit-action-title')}
							key={`edit${comment.id}`}
							onClick={this.openEdit}
						/>,
						<MenuItem
							primaryText={t('common.delete-title')}
							key={`remove${comment.id}`}
							onClick={() => { this.props.deleteComment(comment); }}
						/>,
					]
				}
				{comment.userID !== this.props.userId &&
					<MenuItem
						primaryText={t('common.report-action-title')}
						onClick={() => toggleReportPopup(comment)}
					/>
				}
				{comment.userID !== this.props.userId &&
					accessLevel > 0 &&
					<MenuItem
						onClick={() => toggleRemovalPopup(comment)}
						primaryText={(accessLevel === 1 && commentType !== 'lesson') ?
							t('discuss.forum_request_removal_prompt_title') :
							t('discuss.forum_remove_prompt_title')
						}
					/>
				}
			</IconMenu>
		);
	}

	getEditableArea = (comment) => {
		const { recompute } = this.props;
		const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);
		const previewsData = generatePreviews(this.props.comment.message);
		const { isReplyOpen, replyLength } = this.state;

		return (
			<div style={styles.commentContent}>
				{!isEditing &&
					<div>
						<Linkify>
							<div style={styles.commentMessage}>{replaceMention(this.props.comment.message)}</div>
						</Linkify>
						{previewsData.map(singlePreviewData => (
							<PreviewItem
								{...singlePreviewData}
								recompute={recompute}
								key={singlePreviewData.link}
							/>
						))}
					</div>
				}
				{isEditing &&
					[
						<MentionInput
							key={`commentTextField${comment.id}`}
							ref={(mentionInput) => { this.mentionInput = mentionInput; }}
							onFocus={this.openReply}
							onBlur={this.closeReply}
							onLengthChange={this.onLengthChange}
							style={{ minHeight: 160 }}
							getUsers={getMentionFetcher(this.props.commentType)}
							placeholder={!isReplyOpen && replyLength === 0 ? 'Message' : ''}
							initText={this.props.comment.message}
						/>,
						<span style={styles.textFieldCoutner} key={`commentCounter${comment.id}`}>{2048 - replyLength} characters remaining</span>,
					]
				}
			</div>
		);
	}

	render() {
		const {
			comment,
			comment: {
				id,
				date,
				level,
				badge,
				userID,
				parentID,
				avatarUrl,
				userName,
			},
			comments,
			accessLevel,
			activeComment,
			t,
		} = this.props;

		if (comment.type === 'LOAD_MORE') {
			const hasParentId = comment.parentId !== null;
			const filteredCommentsLength = hasParentId ?
				comments.filter(c => (c.type !== 'LOAD_MORE' && comment.parentId === c.parentID)) :
				comments.filter(c => c.type !== 'LOAD_MORE');
			// Shitty temporary solution
			return filteredCommentsLength.length <= 1 ? null : (
				<FlatButton
					label={t('common.loadMore')}
					onClick={this.loadMore}
				/>);
		}

		const isReply = parentID != null;
		const isEditing = (this.props.isEditing && activeComment.id === id);

		return (
			<div style={{ ...styles.commentContainer.base, marginLeft: isReply ? 20 : 0 }}>
				<div style={styles.comment.base}>
					<div style={styles.commentConent}>
						<ProfileAvatar
							size={40}
							withTooltip
							level={level}
							badge={badge}
							userID={userID}
							userName={userName}
							avatarUrl={avatarUrl}
							tooltipId={`comment-${id}`}
						/>
						<div
							style={{
								...styles.commentDetailsWrapper.base,
								...(isEditing ? styles.commentDetailsWrapper.editing : {}),
							}}
						>
							<div style={styles.commentDetails}>
								<div style={styles.heading}>
									<Link to={`/profile/${userID}`} style={styles.noStyle}>
										<span style={styles.userName}>{userName}</span>
									</Link>
									<div style={styles.heading}>
										<p style={styles.commentDate}>{updateDate(date)}</p>
										{!isEditing && this.getMenuControls(comment)}
									</div>
								</div>
								{this.getEditableArea(comment)}
							</div>
							<div style={styles.commentControls.base}>
								{!isEditing &&
									<VoteControls
										getVotes={this.getVotes}
										userVote={comment.vote}
										accessLevel={accessLevel}
										totalVotes={comment.votes}
										getDownvotes={this.getDownvotes}
										onUpvote={() => this.props.voteComment(comment, 1)}
										onDownvote={() => this.props.voteComment(comment, -1)}
									/>
								}
								{isEditing && this.getEditControls()}
								{!isEditing && this.getPrimaryControls(comment)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Comment;
