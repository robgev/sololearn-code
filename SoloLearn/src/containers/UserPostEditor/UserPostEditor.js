import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import {
	Title,
	PaperContainer,
	FlexBox,
} from 'components/atoms';
import { Layout } from 'components/molecules';
import ProfileAvatar from 'components/ProfileAvatar';

import Storage from 'api/storage';

import DraftEditor from './DraftEditor';
import EditorActions from './EditorActions';

import BackgroundIconButton from './BackgroundIconButton';

import { getPostBackgrounds } from './userpost.actions';

import './styles.scss';

const UserPost = ({ params }) => {
	const [ backgrounds, setBackgrounds ] = useState([]);
	const [ selectedBackgroundId, setSelectedBackgroundId ] = useState(null);

	useEffect(() => {
		getPostBackgrounds()
			.then((res) => {
				setBackgrounds([ { type: 'color', color: 'white' }, ...res.backgrounds ]);
			});
	}, []);

	const background = selectedBackgroundId === null
		? null
		: backgrounds.find(b => b.id === selectedBackgroundId);

	const profile = Storage.load('profile');
	return (
		<Layout>
			<PaperContainer className="user-post-main-container">
				<FlexBox column fullWith>
					<Title className="user-post-main-title">{`${params.id ? 'Edit post' : 'New Post'}`}</Title>
					<ProfileAvatar
						userId={profile.id}
						avatarUrl={profile.avatarUrl}
						badge={profile.badge}
						userName={profile.name}
						withUserNameBox
						withBorder
						className="profile-avatar-container"
					/>
					<DraftEditor background={background} />
					<FlexBox className="backgrounds-container">
						{
							backgrounds.map(el =>
								<BackgroundIconButton onSelect={setSelectedBackgroundId} background={el} />)
						}
					</FlexBox>
					<EditorActions />
				</FlexBox>
			</PaperContainer>
		</Layout>
	);
};

export default withRouter(UserPost);
