import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';

import {
	Loading,
	Container,
	Image,
	FlexBox,
	PaperContainer,
} from 'components/atoms';
import { Layout } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';
import { FeedBottomBarFullStatistics } from 'components/organisms';

import UserPostEditor from 'containers/UserPostEditor/DraftEditor';
import Comments from 'containers/Comments/CommentsBase';

import { getUserPost } from './userpostdetails.actions';

import './styles.scss';

const UserPostDetails = ({ params }) => {
	const [ userPost, setUserPost ] = useState(null);

	useEffect(() => {
		if (params.id) {
			getUserPost(parseInt(params.id, 10))
				.then(res => setUserPost(res.post));
		}
	}, []);

	return (
		<Layout>
			{userPost ?
				<Container>
					<PaperContainer className="user-post-details-main-container">
						<FlexBox fullwidth column>
							<ProfileAvatar
								userID={userPost.userID}
								avatarUrl={userPost.avatarUrl}
								badge={userPost.badge}
								userName={userPost.userName}
								withUserNameBox
								withBorder
								className="profile-avatar-container"
							/>
							{userPost.message ?
								<UserPostEditor
									measure={() => { }}
									background={userPost.background || { type: 'none', id: -1 }}
									editorInitialText={userPost.message}
									isEditorReadOnly
								/>
								: null
							}
							{userPost.imageUrl ? <Image src={userPost.imageUrl} onLoad={() => { }} style={{ maxWidth: '400px' }} alt="" /> : null}
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
						id={userPost.id}
						useWindow={false}
						commentsType="post"
						commentsCount={userPost.comments}
					/>
				</Container>
				:
				<Loading />
			}
		</Layout>
	);
};

export default withRouter(UserPostDetails);
