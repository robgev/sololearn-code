import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { PromiseButton } from 'components/LoadingButton';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import UserTooltip from 'components/UserTooltip';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { updateDate, generatePreviews } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import RemovalPopup from './RemovalPopup';

import {
	Container,
	SecondaryTextBlock,
	MenuItem,
	Popup, 
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
} from 'components/atoms';
import {
	ProfileAvatar,
	IconMenu,
	FlatButton,
	PrimaryButton,
	
} from 'components/molecules'

import { VoteActions } from 'components/organisms';

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
			onVote, selfDestruct, onRepliesButtonClick,
			t, children, onRequestRemoval, accessLevel,
		} = this.props;
		const userObj = {name: userName, id: userID, level, badge, avatarUrl}
		const previewsData = generatePreviews(message);

		return (
			<Container
				ref={(node) => { this.mainDiv = node; }}
				className={`comment-item ${this.highlighted ? 'animate' : ''}`}
			>
				<Container className="comment-header">
					<ProfileAvatar user={userObj} />
					<Container className="comment-meta-info">
						<SecondaryTextBlock className="comment-date">{updateDate(date)}</SecondaryTextBlock>
						<IconMenu
						>
							{userID === userProfile.id &&
								[
									<MenuItem
										key={`edit${id}`}
										onClick={this.toggleEdit}
									>{t('common.edit-action-title')}</MenuItem>,
									<MenuItem
										key={`remove${id}`}
										onClick={this.toggleDeleteDialog}
									>{t('common.delete-title')}</MenuItem>,
								]
							}
							{userID !== userProfile.id &&
								<MenuItem
									onClick={this.toggleReportPopup}
								>{t('common.report-action-title')}</MenuItem>
							}
							{userID !== userProfile.id &&
								accessLevel > 0 &&
								<MenuItem
									onClick={this.toggleRemovalPopup}
								>
									{
										(accessLevel === 1 &&
										(commentsType !== 'lesson' && commentsType !== 'userLesson')) ?
										t('discuss.forum_request_removal_prompt_title') :
										t('discuss.forum_remove_prompt_title')
									}
								</MenuItem>
							}
						</IconMenu>
					</Container>

				</Container>
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
				<Container className="comment-bottom-toolbar">
					<VoteActions
						id={id}
						type={`${commentsType}Comment`}
						initialVote={vote}
						initialCount={votes}
						onChange={(vote)=>{onVote(vote)}}
					/>
					<Container className="comment-reply-actions">
						<FlatButton
							onClick={this.onReply}
						>
							{t('comments.reply')}
						</FlatButton>
						{
							parentID === null && replies !== 0 && (
								<Container>
									<PromiseButton
										label={replies === 1 ? t('comments.replies-one') : `${replies} ${t('comments.replies-other')}`}
										onClick={onRepliesButtonClick}
									/>
								</Container>
							)
						}
					</Container>
				</Container>

				<Popup
					onClose={this.toggleDeleteDialog}
					open={this.deleteOpen}
				>
					<PopupTitle>{t('comments.lesson_comment_remove_title')}</PopupTitle>
					<PopupContent>
						<PopupContentText>{t('comments.lesson_comment_remove_message')}</PopupContentText>
					</PopupContent>
					<PopupActions>
						<FlatButton
							variant="contained"
							onClick={this.toggleDeleteDialog}
						>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton
							variant="contained"
							onClick={selfDestruct}
						>
							{t('common.delete-title')}
						</FlatButton>,

					</PopupActions>
				</Popup>

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
			</Container>
		);
	}
}

export default CommenView;
