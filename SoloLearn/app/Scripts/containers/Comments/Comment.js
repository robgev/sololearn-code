// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Material UI components
import { TextField, IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import { getLikesAndDownvotesInternal } from 'actions/likes';

// Utils
import VoteControls from 'components/Shared/VoteControls';
import { updateDate, updateMessage, generatePreviews } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import PreviewItem from 'components/Shared/PreviewItem';
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
		errorText: '',
		textFieldValue: this.props.comment.message,
	};

	onChange = (e) => {
		if (e.target.value.length === 0) {
			this.setState({
				textFieldValue: e.target.value,
				errorText: 'This field is required',
			});
		} else {
			this.setState({
				textFieldValue: e.target.value,
				errorText: '',
			});
		}
	}

	openCloseReplies = () => {
		const { comment } = this.props;
		const willLoadReplies = comment.repliesArray && comment.repliesArray.length === 0;
		const type = willLoadReplies ? loadRepliesTypes.LOAD_REPLIES : loadRepliesTypes.CLOSE_REPLIES;
		this.props.loadReplies(comment.parentID || comment.id, type);
	}

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
						label={comment.replies + (comment.replies === 1 ? t('comments.reply') : t('comments.replies-other'))}
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
		this.props.openEdit(comment.id, comment.parentID, comment.userName, () => {
			setTimeout(() => this._editRef.focus(), 100);
		});
	}

	closeEdit = () => {
		this.props.cancelAll();
		this.setState({
			errorText: '',
			textFieldValue: this.props.comment.message,
		});
	}

	getVotes = () => {
		const { comment, commentType, getLikes } = this.props;
		getLikes(`${commentType}CommentLikes`, comment.id);
	}

	getDownvotes = () => {
		const { comment, commentType, getLikes } = this.props;
		getLikes(`${commentType}CommentDownvotes`, comment.id);
	}

	getEditControls = () => {
		const saveDisabled = this.state.errorText.length === 0;
		const { t } = this.props;
		return (
			<div className="edit-controls" style={styles.commentControls.right}>
				<FlatButton
					label={t('common.cancel-title')}
					onClick={this.closeEdit}
				/>
				<FlatButton
					label={t('common.save-action-title')}
					primary={saveDisabled}
					disabled={!saveDisabled}
					onClick={() => { this.props.editComment(this.props.comment, this.state.textFieldValue); }}
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
				{		comment.userID === this.props.userId &&
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
				{ comment.userID !== this.props.userId &&
					<MenuItem
						primaryText={t('common.report-action-title')}
						onClick={() => toggleReportPopup(comment)}
					/>
				}
				{ comment.userID !== this.props.userId &&
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
		const previewsData = generatePreviews(this.state.textFieldValue);

		return (
			<div style={styles.commentContent}>
				{!isEditing &&
					<div>
						<div
							dangerouslySetInnerHTML={{ __html: updateMessage(this.state.textFieldValue) }}
							style={styles.commentMessage}
						/>
						{ previewsData.map(singlePreviewData => (
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
						<TextField
							key={`commentTextField${comment.id}`}
							hintText="Message"
							multiLine
							maxLength="2048"
							rowsMax={4}
							fullWidth
							ref={(_editRef) => { this._editRef = _editRef; }}
							defaultValue={this.state.textFieldValue}
							errorText={this.state.errorText}
							onChange={e => this.onChange(e)}
							style={styles.textField}
						/>,
						<span style={styles.textFieldCoutner} key={`commentCounter${comment.id}`}>{2048 - this.state.textFieldValue.length} characters remaining</span>,
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
				userID,
				parentID,
				avatarUrl,
				userName,
			},
			accessLevel,
			activeComment,
			t,
		} = this.props;
		if (this.props.comment.id && this.props.comment.type === 'LOAD_MORE') {
			return (
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
							userID={userID}
							userName={userName}
							avatarUrl={avatarUrl}
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
