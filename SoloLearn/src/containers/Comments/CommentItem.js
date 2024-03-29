import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { updateDate, generatePreviews } from 'utils';
import PreviewItem from 'components/PreviewItem';
import {
	ListItem,
	FlexBox,
	Container,
	SecondaryTextBlock,
	MenuItem,
} from 'components/atoms';
import {
	FlatButton,
	RaisedButton,
	UsernameLink,
	ProfileAvatar,
	PromiseButton,
	ModBadge,
	IconMenu,
} from 'components/molecules';
import { Mention, CountingMentionInput, VoteActions } from 'components/organisms';
import './CommentItem.scss';

class CommentItem extends Component {
static serializeProfile = comment => ({
	id: comment.userID,
	badge: comment.badge,
	avatarUrl: comment.avatarUrl,
	name: comment.userName,
	level: comment.level,
})

render() {
	const {
		t,
		comment,
		isEditing,
		type,
		onVote,
		onReply,
		edit,
		onRepliesButtonClick,
		accessLevel,
		userProfileId,
		toggleDeleteDialog,
		toggleReportPopup,
		toggleRemovalPopup,
		toggleEdit,
		onEditButtonEnabledChange,
		getMentionUsers,
		isEditButtonEnabled,
		toggleSigninPopup,
	} = this.props;
	const {
		id,
	} = comment;
	const profile = CommentItem.serializeProfile(comment);

	return (
		<Fragment>
			<ListItem>
				<FlexBox fullWidth className={`comment-item-container ${comment.parentID === null ? '' : 'replay'}`}>
					<Container>
						<ProfileAvatar
							size="extra-small"
							user={profile}
						/>
					</Container>
					<FlexBox
						column
						fullWidth
						className={`comment-item_wrapper ${isEditing ? 'edit' : ''}`}
					>
						<Container className="comment-item_comment-container">
							{ !isEditing &&
							<FlexBox align className="comment-item_author">
								<UsernameLink
									className="comment-item_user-name"
									to={`/profile/${profile.id}`}
								>
									{profile.name}
								</UsernameLink>
								<ModBadge
									className="badge comment-item_user-badge"
									badge={profile.badge}
								/>
							</FlexBox>
							}
							{
								isEditing
									? (
										<Container className="comment-input-toolbar">
											<Container className="input-bar edit-input">
												<CountingMentionInput
													className="counting-mention-input"
													ref={(i) => { this.editMentionInput = i; }}
													getUsers={getMentionUsers}
													initText={comment.message}
													onSubmitEnabledChange={onEditButtonEnabledChange}
													placeholder={t('comments.write-comment-placeholder')}
													maxLength={1024}
												/>
											</Container>
											<FlatButton className="comments_text-button" onMouseDown={toggleEdit}>
												{t('common.cancel-title')}
											</FlatButton>
											<RaisedButton
												className="comment-edit-button"
												disabled={!isEditButtonEnabled}
												onMouseDown={() => {
													edit({ message: this.editMentionInput.popValue(), id });
													toggleEdit();
												}}
											>
												{t('common.edit-action-title')}
											</RaisedButton>
										</Container>
									)
									: (
										<Container className="comment_item-text">
											<Mention text={comment.message} />
											{generatePreviews(comment.message).map(singlePreviewData => (
												<PreviewItem
													{...singlePreviewData}
													key={singlePreviewData.link}
													className="comment-preview"
												/>
											))}
										</Container>
									)
							}
						</Container>
						{!isEditing &&
						<FlexBox align justifyBetween>
							<VoteActions
								small
								id={comment.id}
								type={`${type}Comment`}
								toggleSigninPopup={toggleSigninPopup}
								initialVote={comment.vote}
								initialCount={comment.votes}
								onChange={(vote) => { onVote(vote); }}
							/>
							{
								comment.parentID === null && comment.replies > 0 && (
									<PromiseButton
										className="comments_text-button"
										fire={onRepliesButtonClick}
										mouseDown
									>
										{comment.replies === 1 ? t('comments.replies-one') : `${comment.replies} ${t('comments.replies-other')}`}
									</PromiseButton>
								)
							}
							<FlatButton
								onClick={onReply}
								className="comments_text-button"
							>
								{t('comments.reply')}
							</FlatButton>
							<Container>
								<SecondaryTextBlock>
									{updateDate(comment.date)}
								</SecondaryTextBlock>
							</Container>
						</FlexBox>
						}
						<Container className="comment-item_icon-menu">
							{ !isEditing &&
							<IconMenu>
								{comment.userID === userProfileId &&
								<Fragment>
									<MenuItem onClick={toggleEdit}>
										{t('common.edit-action-title')}
									</MenuItem>
									<MenuItem onClick={toggleDeleteDialog}>
										{t('common.delete-title')}
									</MenuItem>
								</Fragment>
								}
								{comment.userID !== userProfileId &&
								<MenuItem onClick={toggleReportPopup}>
									{t('common.report-action-title')}
								</MenuItem>
								}
								{(comment.userID !== userProfileId && accessLevel > 0) &&
								<MenuItem onClick={toggleRemovalPopup}>
									{
										accessLevel > 1
											? t('common.remove-title')
											: t('discuss.forum_request_removal_prompt_title')
									}
								</MenuItem>
								}
							</IconMenu>
							}
						</Container>
					</FlexBox>
				</FlexBox>
			</ListItem>
		</Fragment>
	);
}
}

export default translate()(CommentItem);

/*
<Container className="comment-header">
<ProfileAvatar user={userObj} />
<Container className="comment-meta-info">
<SecondaryTextBlock className="comment-date">{updateDate(date)}</SecondaryTextBlock>
<IconMenu >
{userID === userProfile.id &&
[
<MenuItem
key={`edit${id}`}
onClick={this.toggleEdit}
>{t('common.edit-action-title')}
</MenuItem>,
<MenuItem
key={`remove${id}`}
onClick={this.toggleDeleteDialog}
>{t('common.delete-title')}
</MenuItem>,
]
}
{userID !== userProfile.id &&
<MenuItem
onClick={this.toggleReportPopup}
>{t('common.report-action-title')}
</MenuItem>
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
onChange={(vote) => { onVote(vote); }}
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

*/
