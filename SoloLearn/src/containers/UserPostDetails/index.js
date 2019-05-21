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
import { Layout, IconMenu } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';
import { FeedBottomBarFullStatistics } from 'components/organisms';
import { ShareIcon } from 'components/icons';

import UserPostDraftEditor from 'containers/UserPostEditor/DraftEditor';
import UserPostEditor from 'containers/UserPostEditor';
import Comments from 'containers/Comments/CommentsBase';

import { getUserPost, deleteUserPost } from './userpostdetails.actions';

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

	const deletePostHandler = () => {
		deleteUserPost(userPost.id);
		browserHistory.push('/feed');
	};

	const editPostHandler = () => {
		getUserPost(userPost.id)
			.then(res => setUserPost(res.post));
	};

	useEffect(() => {
		if (userPost) { console.log('message: ', userPost.message); }
	}, [ userPost ]);

	return (
		<Layout>
			{userPost ?
				<Container className="user-post-details-page-container">
					<PaperContainer className="user-post-details-main-container">
						<FlexBox fullwidth column>
							<FlexBox justifyBetween align>
								<ProfileAvatar
									userID={userPost.userID}
									avatarUrl={userPost.avatarUrl}
									badge={userPost.badge}
									userName={userPost.userName}
									withUserNameBox
									withBorder
									className="profile-avatar-container"
								/>
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
							{userPost.message ?
								<UserPostDraftEditor
									key={userPost.message}
									measure={() => { }}
									background={userPost.background || { type: 'none', id: -1 }}
									editorInitialText={userPost.message}
									isEditorReadOnly
								/>
								: null
							}
							{userPost.imageUrl ? <Image src={userPost.imageUrl} onLoad={() => { }} style={{ maxWidth: '400px' }} alt="" /> : null}
							{profile.id !== userPost.userID ?
								<FlexBox justifyEnd>
									<Chip
										icon={<ShareIcon />}
										label="Share"
										onClick={() => setIsCreatePostPopupOpen(true)}
										className="user-post-details-share-chip"
									/>
								</FlexBox>
								:
								null
							}
							<FeedBottomBarFullStatistics
								type="post"
								date={userPost.date}
								id={userPost.id}
								userVote={userPost.vote}
								totalVotes={userPost.votes}
								className="user-post-details-bottom-bar"
								comments={userPost.comments}
								views={userPost.viewCount}
							/>
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
								alternateSuccessPopupHandler={editPostHandler}
							/>
							:
							<UserPostEditor
								closePopup={() => setIsCreatePostPopupOpen(false)}
								draftEditorInitialText={window.location.href}
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
