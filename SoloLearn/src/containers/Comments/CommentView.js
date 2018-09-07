import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import ProfileAvatar from 'components/ProfileAvatar';
import VoteControls from 'components/VoteControls';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import UserTooltip from 'components/UserTooltip';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'components/StyledDialog';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { updateDate, generatePreviews } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import RemovalPopup from './RemovalPopup';
import './comment.scss';

@translate(null, { withRef: true })
@observer
class CommenView extends Component {
	@observable highlighted = false;
	@observable deleteOpen = false;
	@observable isEditing = false;
	@observable removalPopupOpen = false;
	@observable reportPopupOpen = false;
	@action toggleReportPopup = () => {
		this.reportPopupOpen = !this.reportPopupOpen;
	}
	@action toggleRemovalPopup = () => {
		this.removalPopupOpen = !this.removalPopupOpen;
	}
	@action toggleDeleteDialog = () => {
		this.deleteOpen = !this.deleteOpen;
	}
	@action toggleEdit = () => {
		this.isEditing = !this.isEditing;
	}
	scrollIntoView = () => {
		this.mainDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.highlighted = true;
		setTimeout(() => {
			this.highlighted = false;
		}, 2000);
	}
	onReply = () => {
		const { id, userID, userName } = this.props.comment;
		this.props.onReply({ id, userID, userName });
	}
	render() {
		const {
			date, message, level, userName, avatarUrl,
			vote, votes, userID, replies, badge, id, parentID,
		} = this.props.comment;
		const {
			commentsType, userProfile,
			upvote, downvote, selfDestruct, onRepliesButtonClick,
			t, children, onRequestRemoval, accessLevel,
		} = this.props;

		const previewsData = generatePreviews(message);

		return (
			<div
				ref={(node) => { this.mainDiv = node; }}
				className={`comment-item ${this.highlighted ? 'animate' : ''}`}
			>
				<div className="comment-header">
					<UserTooltip userData={this.props.comment}>
						<ProfileAvatar
							size={40}
							withUserNameBox
							level={level}
							badge={badge}
							userID={userID}
							userName={userName}
							avatarUrl={avatarUrl}
						/>
					</UserTooltip>
					<div className="comment-meta-info">
						<p className="comment-date">{updateDate(date)}</p>
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
							targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						>
							{userID === userProfile.id &&
								[
									<MenuItem
										primaryText={t('common.edit-action-title')}
										key={`edit${id}`}
										onClick={this.toggleEdit}
									/>,
									<MenuItem
										primaryText={t('common.delete-title')}
										key={`remove${id}`}
										onClick={this.toggleDeleteDialog}
									/>,
								]
							}
							{userID !== userProfile.id &&
								<MenuItem
									primaryText={t('common.report-action-title')}
									onClick={this.toggleReportPopup}
								/>
							}
							{userID !== userProfile.id &&
								accessLevel > 0 &&
								<MenuItem
									onClick={this.toggleRemovalPopup}
									primaryText={(accessLevel === 1 &&
										(commentsType !== 'lesson' && commentsType !== 'userLesson')) ?
										t('discuss.forum_request_removal_prompt_title') :
										t('discuss.forum_remove_prompt_title')
									}
								/>
							}
						</IconMenu>
					</div>

				</div>
				{children({
					isEditing: this.isEditing, message, toggleEdit: this.toggleEdit, id,
				})}
				{previewsData.map(singlePreviewData => (
					<PreviewItem
						{...singlePreviewData}
						key={singlePreviewData.link}
						className="comment-preview"
					/>
				))}
				<div className="comment-bottom-toolbar">
					<VoteControls
						id={id}
						type={`${commentsType}Comment`}
						userVote={vote}
						accessLevel={userProfile.accessLevel}
						totalVotes={votes}
						buttonStyle={{ height: 32, width: 32, padding: 0 }}
						onUpvote={upvote}
						onDownvote={downvote}
					/>
					<div className="comment-reply-actions">
						<FlatButton
							style={{ height: 30, lineHeight: '30px' }}
							labelStyle={{ fontSize: 13 }}
							label="Reply"
							onClick={this.onReply}
						/>
						{
							parentID === null && replies !== 0 && (
								<div>
									<FlatButton
										style={{ height: 30, lineHeight: '30px' }}
										labelStyle={{ fontSize: 13 }}
										label={`${replies} ${replies === 1 ? t('comments.reply') : t('comments.replies-other')}`}
										onClick={onRepliesButtonClick}
									/>
								</div>
							)
						}
					</div>
				</div>
				<Dialog
					title={t('comments.lesson_comment_remove_title')}
					open={this.deleteOpen}
					actions={[
						<FlatButton
							label="Delete"
							onClick={selfDestruct}
							primary
						/>,
						<FlatButton
							label="Cancel"
							onClick={this.toggleDeleteDialog}
							primary
						/>,
					]}
				>
					{t('comments.lesson_comment_remove_message')}
				</Dialog>
				<RemovalPopup
					open={this.removalPopupOpen}
					accessLevel={accessLevel}
					commentsType={commentsType}
					onRequestClose={this.toggleRemovalPopup}
					deleteComment={selfDestruct}
					report={onRequestRemoval}
				/>
				<ReportPopup
					open={this.reportPopupOpen}
					itemId={id}
					onRequestClose={this.toggleReportPopup}
					itemType={ReportItemTypes[`${commentsType}Comment`]}
				/>
			</div>
		);
	}
}

export default CommenView;
