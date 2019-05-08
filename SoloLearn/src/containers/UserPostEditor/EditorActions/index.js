import React from 'react';
import { FlexBox } from 'components/atoms';
import { PromiseButton } from 'components/molecules';

import './styles.scss';

const EditorActions = ({ createPost }) => (
	<FlexBox justifyEnd className="user-post-actions-container">
		<PromiseButton
			raised
			fire={createPost}
		>
			Create Post
		</PromiseButton>
	</FlexBox>
);

export default EditorActions;
