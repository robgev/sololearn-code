import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import { getUserSelector } from 'reducers/reducer_user';
import { translate } from 'react-i18next';
import { determineAccessLevel } from 'utils';

import { clearFeedItems } from 'actions/feed';

import {
	Loading,
	Container,
	Image,
	FlexBox,
	PaperContainer,
	Popup,
	MenuItem,
	Chip,
	TextBlock,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	LayoutWithSidebar,
	IconMenu,
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';
import { ShareIcon } from 'components/icons';

import { updateDate } from 'utils';

import RemovePopup from './RemovePopup';

import UserPostDraftEditor from 'containers/UserPostEditor/DraftEditor';
import UserPostEditor from 'containers/UserPostEditor';
import Comments from 'containers/Comments/CommentsBase';

import { getUserPost, deleteUserPost, sendImpressionByPostId, requestPostRemoval } from './userpostdetails.actions';

import './styles.scss';
import ReportPopup from '../../components/ReportPopup';

const UserPostDetails = ({
	params, profile, t, clearFeedItems,
}) => {
	const [ userPost, setUserPost ] = useState(null);
	const [ isError, setError ] = useState(false);

	const [ isCreatePostPopupOpen, toggleCreatePostPopupOpen ] = useState(false);
	const [ isRepostPopupOpen, toggleRepostPopup ] = useState(false);
	const [ isDeleteConfirmationOpen, toggleDeleteConfirmationOpen ] = useState(false);
	const [ isReportPopupOpen, toggleReportPopup ] = useState(false);

	const setPostRequest = () => {
		getUserPost(parseInt(params.id, 10))
			.then((res) => {
				if (res.error) {
					setError(true);
					return;
				}
				setUserPost(res.post);
			})
			.catch(() => {
				setError(true);
			});
	};

	useEffect(() => {
		setUserPost(null);
		setError(false);
		setPostRequest();
	}, [ params.id ]);

	useEffect(() => {
		sendImpressionByPostId(parseInt(params.id, 10));
	}, []);
	const canEdit = userPost && profile.id === userPost.userID;
	const canReport = userPost && profile.id !== userPost.userID;
	const canRequestRemoval = userPost && profile.id !== userPost.userID && determineAccessLevel(profile.accessLevel) === 1;
	const canRemove = userPost && (profile.id === userPost.userID || determineAccessLevel(profile.accessLevel) > 1);
	console.log(canRemove, determineAccessLevel(profile.accessLevel));
	const deletePostHandler = () => {
		if (canRemove) {
			return deleteUserPost(userPost.id)
				.then(() => {
					clearFeedItems();
					browserHistory.push('/feed');
				});
		}
		return requestPostRemoval(userPost.id)
			.then(() => toggleDeleteConfirmationOpen(false));
	};

	const editPostHandler = (editedPost) => {
		setUserPost({ ...userPost, ...editedPost });
	};

	return (
		<LayoutWithSidebar
			sidebar={<TextBlock>Coming Soon...</TextBlock>}
		>
			{userPost &&
				<Container className="user-post-details-page-container">
					<PaperContainer className="user-post-details-main-container">
						<FlexBox fullwidth column>
							<FlexBox justifyBetween align className="up-details-top-bar-container">
								<FlexBox align>
									<ProfileAvatar
										user={{
											name: userPost.userName,
											id: userPost.userID,
											badge: userPost.badge,
											avatarUrl: userPost.avatarUrl,
										}}
									/>
									<FlexBox column className="up-profile-username-container">
										<FlexBox>
											<UsernameLink
												to={`/profile/${userPost.userID}`}
												className="up-profile-username-link"
											>
												{userPost.userName}
											</UsernameLink>
										</FlexBox>
										<SecondaryTextBlock className="date up-details-date">{updateDate(userPost.date)}</SecondaryTextBlock>
									</FlexBox>
									<ModBadge
										badge={userPost.badge}
									/>
								</FlexBox>
								<IconMenu>
									{
										canEdit
											? <MenuItem onClick={() => toggleCreatePostPopupOpen(true)}>
												{t('common.edit-action-title')}
											</MenuItem>
											: null
									}
									{
										canReport
											? <MenuItem onClick={() => toggleReportPopup(true)}>
												{t('common.report-action-title')}
             </MenuItem>
											: null
									}
									{
										canRequestRemoval
											? <MenuItem onClick={() => toggleDeleteConfirmationOpen(true)}>
												Request Removal
             </MenuItem>
											: null
									}
									{
										canRemove
											? <MenuItem onClick={() => toggleDeleteConfirmationOpen(true)}>
												{t('common.delete-title')}
             </MenuItem>
											: null
									}
								</IconMenu>
								<RemovePopup
									open={isDeleteConfirmationOpen}
									onClose={() => toggleDeleteConfirmationOpen(false)}
									removeAction={deletePostHandler}
									canRemove={canRemove}
								/>
								<ReportPopup
									open={isReportPopupOpen}
									onClose={() => toggleReportPopup(false)}
									itemId={userPost.id}
									itemType={9}
								/>
							</FlexBox>

							<Container style={{ padding: userPost.background && userPost.background.type !== 'none' ? 0 : '0 15px' }}>
								{userPost.message ?
									<UserPostDraftEditor
										key={`${userPost.message}:${userPost.backgroundID ? userPost.backgroundID : -1}`}
										measure={() => { }}
										background={userPost.background || { type: 'none', id: -1 }}
										editorInitialText={userPost.message}
										isEditorReadOnly
									/>
									: null
								}
							</Container>
							{userPost.imageUrl ?
								<Image
									src={userPost.imageUrl}
									onLoad={() => { }}
									className="up-details-image"
								/>
								: null}
							<FlexBox align justifyBetween className="up-details-bottom-bar-container">
								<FeedBottomBarFullStatistics
									type="userPost"
									date={userPost.date}
									id={userPost.id}
									userVote={userPost.vote}
									totalVotes={userPost.votes}
									className="user-post-details-bottom-bar"
									comments={userPost.comments}
									views={userPost.viewCount}
									withDate={false}
								/>
								<Chip
									icon={<ShareIcon />}
									label="Repost" // waiting for translation (requested)
									onClick={() => toggleRepostPopup(true)}
									className="user-post-details-share-chip"
								/>
							</FlexBox>
						</FlexBox>
					</PaperContainer>
					<Comments
						useWindow
						id={userPost.id}
						commentsType="post"
						commentsCount={userPost.comments}
					/>
					<Popup
						open={isCreatePostPopupOpen}
					>
						<UserPostEditor
							closePopup={() => toggleCreatePostPopupOpen(false)}
							draftEditorInitialText={userPost.message ? userPost.message : ''}
							draftEditorInitialBackground={userPost.background ? userPost.background : null}
							initialImageSource={userPost.imageUrl ? userPost.imageUrl : null}
							initialSelectedBackgroundId={userPost.backgroundID ? userPost.backgroundID : -1}
							initialUserPostId={userPost.id}
							afterPostCallback={editPostHandler}
						/>

					</Popup>
					<Popup
						open={isRepostPopupOpen}
					>
						<UserPostEditor
							closePopup={() => toggleRepostPopup(false)}
							draftEditorInitialText={`\n${window.location.href}`}
						/>

					</Popup>
				</Container>
			}
			{!userPost && !isError && <Loading />}
			{isError &&
				<PaperContainer className="up-details-error-container">
					<TextBlock>
						{'Page not found.'}
					</TextBlock>
				</PaperContainer>
			}
		</LayoutWithSidebar>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
});

export default translate()(connect(mapStateToProps, { clearFeedItems })(withRouter(UserPostDetails)));
