import React from 'react';
import { FlexBox } from 'components/atoms';
import { PromiseButton } from 'components/molecules';

import { getUserPost } from '../userpost.actions';

import './styles.scss';

const EditorActions = ({ isPostButtonDisabled, createNewPostHandler }) => (
	<FlexBox justifyEnd className="user-post-actions-container">
		<PromiseButton
			raised
			fire={() => getUserPost(97742)}
			style={{ marginRight: '10px' }}
		>
			Get Post (test)
		</PromiseButton>
		<PromiseButton
			raised
			color="primary"
			disabled={isPostButtonDisabled}
			fire={createNewPostHandler}
		>
			Create Post
		</PromiseButton>
	</FlexBox>
);

export default EditorActions;
