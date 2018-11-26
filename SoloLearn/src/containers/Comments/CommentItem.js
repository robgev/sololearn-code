import React, { Fragment } from 'react';
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
import { Mention, VoteActions } from 'components/organisms';

const CommentItem = ({
	t,
	comment,
	user,
	type,
	onVote,
	onReply,
	onRepliesButtonClick,
	accessLevel,
	userProfileId,
	toggleDeleteDialog,
	toggleReportPopup,
	toggleRemovalPopup,
	toggleEdit,
}) => {
	const {
		parentID,
		date,
		userID,
		id,
		message,
		vote,
		votes,
		replies,
	} = comment;
	return (
		<Fragment>
			<ListItem>
				<FlexBox fullWidth className={`comment-item-container ${comment.parentID === null ? '' : 'replay'}`}>
					<Container>
						<ProfileAvatar user={user} />
					</Container>
					<FlexBox column fullWidth>
						<FlexBox>
							<FlexBox column fullWidth>
								<FlexBox justifyBetween fullWidth align>
									<UsernameLink>
										{user.name}
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
												accessLevel > 0 &&
												<MenuItem
													onClick={toggleRemovalPopup}
												>
													{
														(accessLevel === 1 &&
														(type !== 'lesson' && type !== 'userLesson')) ?
															t('discuss.forum_request_removal_prompt_title') :
															t('discuss.forum_remove_prompt_title')
													}
												</MenuItem>
											}
										</IconMenu>
									</Container>
									
								</FlexBox>
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
							</FlexBox>
							
						</FlexBox>
						<FlexBox justifyBetween>
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
								<FlatButton
									onClick={onReply}
								>
									{t('comments.reply')}
								</FlatButton>
								{
									comment.parentID === null && comment.replies !== 0 && (
										<PromiseButton
											fire={onRepliesButtonClick}
											mouseDown
										>
											{comment.replies === 1 ? t('comments.replies-one') : `${comment.replies} ${t('comments.replies-other')}`}
										</PromiseButton>
									)
								}
							</Container>
						</FlexBox>
					</FlexBox>
				</FlexBox>
			</ListItem>
			<HorizontalDivider />
		</Fragment>
	)
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