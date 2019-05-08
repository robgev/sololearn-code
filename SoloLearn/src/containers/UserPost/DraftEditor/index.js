import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';

import { Container } from './node_modules/components/atoms';

import './styles.scss';

function UserPostEditor() {
	const [ editorState, setEditorState ] = useState(EditorState.createEmpty());

	return (
		<Container className="draft-editor-container">
			<Editor
				editorState={editorState}
				onChange={editorState => setEditorState(editorState)}
			/>
		</Container>
	);
}

export default UserPostEditor;
