// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Material UI components
import { TextField, IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import getLikes from 'actions/likes';

// Utils
import Likes from 'components/Shared/Likes';
import VoteControls from 'components/Shared/VoteControls';
import { updateDate, updateMessage } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import { loadRepliesTypes } from './Comments';

// Style
import { CommentStyle as styles } from './styles';

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	getLikes,
};

// i18n
import { translate } from 'react-i18next';

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
		this.props.openEdit(comment.id, comment.parentID, comment.userName);
	}

	closeEdit = () => {
		this.props.cancelAll();
		this.setState({
			errorText: '',
			textFieldValue: this.props.comment.message,
		});
	}

	getLikes = () => {
		const { getLikes, comment, commentType } = this.props;
		getLikes(commentType === 'lesson' ? 3 : 4, comment.id);
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

	getMenuControls = comment => {
		const { t } = this.props;
		(
			<IconMenu
				iconButtonElement={<IconButton style={styles.iconMenu.icon}><MoreVertIcon /></IconButton>}
				anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
				targetOrigin={{ horizontal: 'right', vertical: 'top' }}
			>
				{
					comment.userID === this.props.userId ?
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
						:
						<MenuItem
							primaryText={t('common.report-action-title')}
							key={`report${comment.id}`}
						/>
				}
			</IconMenu>
		)
	}

	getEditableArea = (comment) => {
		const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);

		return (
			<div style={styles.commentContent}>
				{!isEditing &&
					<div
						dangerouslySetInnerHTML={{ __html: updateMessage(this.state.textFieldValue) }}
						style={styles.commentMessage}
					/>}
				{isEditing &&
					[
						<TextField
							key={`commentTextField${comment.id}`}
							hintText="Message"
							multiLine
							maxLength="2048"
							rowsMax={4}
							fullWidth
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
			activeComment,
			t
		} = this.props;
		if (this.props.comment.type === 'LOAD_MORE') {
			return (
				<FlatButton
					label={t('common.loadMore')}
					onClick={this.loadMore}
				/>);
		}
		
		const isReply = parentID != null;
		const isEditing = (this.props.isEditing && activeComment.id === id);
		console.log(isEditing);

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
										getVotes={this.getLikes}
										userVote={comment.vote}
										totalVotes={comment.votes}
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

export default translate()(Comment);
