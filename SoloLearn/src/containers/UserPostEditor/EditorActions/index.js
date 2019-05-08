import React from 'react';
import { FlexBox } from 'components/atoms';
import { PromiseButton } from 'components/molecules';

import { getUserPost, getPostBackgrounds } from '../userpost.actions';

import './styles.scss';

const EditorActions = () => (
	<FlexBox justifyEnd className="user-post-actions-container">
		<PromiseButton
			raised
			fire={() => getUserPost(91111)}
			style={{ marginRight: '10px' }}
		>
			Get Post (test)
		</PromiseButton>
		<PromiseButton
			raised
			fire={() => getPostBackgrounds()}
		>
			Get Post Backgrounds (test)
		</PromiseButton>
	</FlexBox>
);

export default EditorActions;
