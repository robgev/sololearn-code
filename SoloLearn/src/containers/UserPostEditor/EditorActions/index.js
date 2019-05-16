import React from 'react';
import { FlexBox } from 'components/atoms';
import { PromiseButton, FlatButton } from 'components/molecules';

import { getUserPost } from '../userpost.actions';

import './styles.scss';

const EditorActions = ({ isPostButtonDisabled, createNewPostHandler, closePopup }) => (
	<FlexBox justifyEnd className="user-post-actions-container">
		<FlatButton
			onClick={closePopup}
			className="user-post-cancel-button"
		>
			Cancel
		</FlatButton>
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
