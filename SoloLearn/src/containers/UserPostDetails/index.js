import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router';
import { getUserSelector } from 'reducers/reducer_user';

import {
	Loading,
	Container,
	Image,
	FlexBox,
	PaperContainer,
	Popup,
	MenuItem,
	Chip,
} from 'components/atoms';
import {
	Layout,
	IconMenu,
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';
import { FeedBottomBarFullStatistics } from 'components/organisms';
import { ShareIcon } from 'components/icons';

import UserPostDraftEditor from 'containers/UserPostEditor/DraftEditor';
import UserPostEditor from 'containers/UserPostEditor';
import Comments from 'containers/Comments/CommentsBase';

import { getUserPost, deleteUserPost, sendImpressionByPostId } from './userpostdetails.actions';

import './styles.scss';

const UserPostDetails = ({
	params, profile,
}) => {
	const [ userPost, setUserPost ] = useState(null);

	const [ isCreatePostPopupOpen, setIsCreatePostPopupOpen ] = useState(false);

	useEffect(() => {
		if (params.id) {
			getUserPost(parseInt(params.id, 10))
				.then(res => setUserPost(res.post));
		}
	}, []);

	useEffect(() => {
		sendImpressionByPostId(parseInt(params.id, 10));
	}, []);

	const deletePostHandler = () => {
		deleteUserPost(userPost.id);
		browserHistory.push('feed');
	};

	const editPostHandler = (editedPost) => {
		setUserPost({ ...userPost, ...editedPost });
	};

	return (
		<Layout>
			{userPost ?
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
										to={`/profile/${userPost.userId}`}
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
										<MenuItem onClick={() => setIsCreatePostPopupOpen(true)}>
											Edit
										</MenuItem>
										<MenuItem onClick={deletePostHandler}>
											Delete
										</MenuItem>
									</IconMenu>
									:
									null
								}
							</FlexBox>
							<Container style={{ padding: userPost.background ? 0 : '0 15px' }}>
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
									type="post"
									date={userPost.date}
									id={userPost.id}
									userVote={userPost.vote}
									totalVotes={userPost.votes}
									className="user-post-details-bottom-bar"
									comments={userPost.comments}
									views={userPost.viewCount}
									withDate={false}
								/>
								{profile.id !== userPost.userID ?
									<Chip
										icon={<ShareIcon />}
										label="Repost"
										onClick={() => setIsCreatePostPopupOpen(true)}
										className="user-post-details-share-chip"
									/>
									:
									null
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
								closePopup={() => setIsCreatePostPopupOpen(false)}
								draftEditorInitialText={userPost.message ? userPost.message : ''}
								draftEditorInitialBackground={userPost.background ? userPost.background : null}
								initialImageSource={userPost.imageUrl ? userPost.imageUrl : null}
								initialSelectedBackgroundId={userPost.backgroundID ? userPost.backgroundID : -1}
								initialUserPostId={userPost.id}
								afterPostCallback={editPostHandler}
							/>
							:
							<UserPostEditor
								closePopup={() => setIsCreatePostPopupOpen(false)}
								draftEditorInitialText={`\n${window.location.href}`}
							/>
						}
					</Popup>
				</Container>
				:
				<Loading />
			}
		</Layout>
	);
};

const mapStateToProps = state => ({
	profile: getUserSelector(state),
});

export default connect(mapStateToProps)(withRouter(UserPostDetails));
