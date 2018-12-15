import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { updateDate, generatePreviews } from 'utils';
import PreviewItem from 'components/PreviewItem';
import {
	ListItem,
	FlexBox,
	HorizontalDivider,
	Container,
	SecondaryTextBlock,
	MenuItem,
} from 'components/atoms';
import {
	FlatButton,
	UsernameLink,
	ProfileAvatar,
	PromiseButton,
	IconMenu,
} from 'components/molecules';
import { Mention, CountingMentionInput, VoteActions } from 'components/organisms';

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
			user,
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
							<ProfileAvatar user={profile} />
						</Container>
						<FlexBox column fullWidth>
							<FlexBox>
								<FlexBox column fullWidth>
									<FlexBox justifyBetween fullWidth align>
										<UsernameLink to={`/profile/${profile.id}`}>
											{profile.name}
										</UsernameLink>
										<Container>
											<SecondaryTextBlock>
												{updateDate(comment.date)}
											</SecondaryTextBlock>
											<IconMenu >
												{comment.userID === userProfileId &&
													[
														<MenuItem
															key={`edit${comment.id}`}
															onClick={toggleEdit}
														>{t('common.edit-action-title')}
														</MenuItem>,
														<MenuItem
															key={`remove${id}`}
															onClick={toggleDeleteDialog}
														>{t('common.delete-title')}
														</MenuItem>,
													]
												}
												{comment.userID !== userProfileId &&
													<MenuItem
														onClick={toggleReportPopup}
													>{t('common.report-action-title')}
													</MenuItem>
												}
												{comment.userID !== userProfileId &&
													accessLevel > 1 &&
													[
														
														<MenuItem
															onClick={toggleRemovalPopup}
														>
															{
																t('discuss.forum_request_removal_prompt_title') 
															}
														</MenuItem>
													]
												}
											</IconMenu>
										</Container>
									</FlexBox>
									<Container>
										{
											isEditing
												? (
													<Container className="comment-input-toolbar">
														<Container className="input-bar reply-input">
															<CountingMentionInput
																style={{ height: 50 }}
																ref={(i) => { this.editMentionInput = i; }}
																getUsers={getMentionUsers}
																initText={comment.message}
																onSubmitEnabledChange={onEditButtonEnabledChange}
																placeholder={t('comments.write-comment-placeholder')}
																maxLength={1024}
															/>
														</Container>
														<FlatButton
															onMouseDown={toggleEdit}
														>
															{t('common.cancel-title')}
														</FlatButton>
														<FlatButton
															disabled={!isEditButtonEnabled}
															onMouseDown={() => {
																edit({ message: this.editMentionInput.popValue(), id });
																toggleEdit();
															}}
														>
															{t('common.edit-action-title')}
														</FlatButton>
													</Container>
												)
												: (
													<Container>
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
								</FlexBox>
							</FlexBox>
							{!isEditing && <FlexBox justifyBetween>
								<Container>
									<VoteActions
										id={comment.id}
										type={`${type}Comment`}
										initialVote={comment.vote}
										initialCount={comment.votes}
										onChange={(vote) => { onVote(vote); }}
									/>
								</Container>
								<Container>
									
									{
										comment.parentID === null && (
											<PromiseButton
												fire={onRepliesButtonClick}
												mouseDown
											>
												{comment.replies === 1 ? t('comments.replies-one') : `${comment.replies} ${t('comments.replies-other')}`}
											</PromiseButton>
										)
									}
									<FlatButton
										onClick={onReply}
									>
										{t('comments.reply')}
									</FlatButton>
								</Container>
							</FlexBox>}
						</FlexBox>
					</FlexBox>
				</ListItem>
				<HorizontalDivider />
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
