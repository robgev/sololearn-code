import React from 'react';
import { withRouter } from 'react-router';
import {
	Title,
	PaperContainer,
	FlexBox,
} from 'components/atoms';
import { Layout } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';

import Storage from 'api/storage';

import UserPostEditor from './UserPostEditor';

import './styles.scss';

const UserPost = ({ params }) => {
	const profile = Storage.load('profile');
	return (
		<Layout>
			<PaperContainer className="user-post-main-container">
				<FlexBox column fullWidth>
					<Title>{`${params.id ? 'Edit post' : 'New Post'}`}</Title>
					<ProfileAvatar
						userId={profile.id}
						avatarUrl={profile.avatarUrl}
						badge={profile.badge}
						userName={profile.name}
						withUserNameBox
						withBorder
					/>
					<UserPostEditor />
				</FlexBox>
			</PaperContainer>
		</Layout>
	);
};

export default withRouter(UserPost);
