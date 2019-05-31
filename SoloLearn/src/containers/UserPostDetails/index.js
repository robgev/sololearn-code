import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import { getUserSelector } from 'reducers/reducer_user';
import { translate } from 'react-i18next';

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
} from 'components/atoms';
import {
	LayoutWithSidebar,
	IconMenu,
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';
import ConfirmationPopup from 'components/ConfirmationPopup';
import { FeedBottomBarFullStatistics } from 'components/organisms';
import { ShareIcon } from 'components/icons';

import UserPostDraftEditor from 'containers/UserPostEditor/DraftEditor';
import UserPostEditor from 'containers/UserPostEditor';
import Comments from 'containers/Comments/CommentsBase';

import { getUserPost, deleteUserPost, sendImpressionByPostId } from './userpostdetails.actions';

import './styles.scss';
import ReportPopup from '../../components/ReportPopup';

const UserPostDetails = ({
	params, profile, t, clearFeedItems,
}) => {
	const [ userPost, setUserPost ] = useState(null);
	const [ isError, setError ] = useState(false);

	const [ isCreatePostPopupOpen, toggleCreatePostPopupOpen ] = useState(false);
	const [ isDeleteConfirmationOpen, toggleDeleteConfirmationOpen ] = useState(false);
	const [ isReportPopupOpen, toggleReportPopup ] = useState(false);

	const setPostRequest = () => {
		console.clear();
		console.log('setPostReq');
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
		if (params.id) {
			setPostRequest();
		}
	}, []);

	useEffect(() => {
		setUserPost(null);
		setPostRequest();
	}, [ params.id ]);

	useEffect(() => {
		sendImpressionByPostId(parseInt(params.id, 10));
	}, []);

	const deletePostHandler = () => {
		deleteUserPost(userPost.id);
		clearFeedItems();
		browserHistory.push('/feed');
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
									<UsernameLink
										to={`/profile/${userPost.userID}`}
										className="up-profile-username-link"
									>
										{userPost.userName}
									</UsernameLink>
									<ModBadge
										badge={userPost.badge}
									/>
								</FlexBox>
								{profile.id === userPost.userID ?
									<IconMenu>
										<MenuItem onClick={() => toggleCreatePostPopupOpen(true)}>
											Edit
										</MenuItem>
										<MenuItem onClick={() => toggleDeleteConfirmationOpen(true)}>
											Delete
										</MenuItem>
									</IconMenu>
									:
									<IconMenu>
										<MenuItem onClick={() => toggleReportPopup(true)}>
											Report
										</MenuItem>
									</IconMenu>
								}
								<ConfirmationPopup
									open={isDeleteConfirmationOpen}
									onCancel={() => toggleDeleteConfirmationOpen(false)}
									onConfirm={deletePostHandler}
									confirmButtonLabel={t('common.delete-title')}
									title="Are you sure you want to permanently remove this post?"
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
								{profile.id !== userPost.userID &&
									<Chip
										icon={<ShareIcon />}
										label="Repost"
										onClick={() => toggleCreatePostPopupOpen(true)}
										className="user-post-details-share-chip"
									/>
								}
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
						{profile.id === userPost.userID ?
							<UserPostEditor
								closePopup={() => toggleCreatePostPopupOpen(false)}
								draftEditorInitialText={userPost.message ? userPost.message : ''}
								draftEditorInitialBackground={userPost.background ? userPost.background : null}
								initialImageSource={userPost.imageUrl ? userPost.imageUrl : null}
								initialSelectedBackgroundId={userPost.backgroundID ? userPost.backgroundID : -1}
								initialUserPostId={userPost.id}
								afterPostCallback={editPostHandler}
							/>
							:
							<UserPostEditor
								closePopup={() => toggleCreatePostPopupOpen(false)}
								draftEditorInitialText={`\n${window.location.href}`}
							/>
						}
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
