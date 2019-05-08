import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorState } from 'draft-js';
import { Container } from 'components/atoms';
import { getBackgroundStyle } from '../utils';

import './styles.scss';

function UserPostEditor({ background }) {
	const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
	const [ canApplyBackground, setCanApplyBackground ] = useState(true);
	const [ fontSize, setFontSize ] = useState(14);

	const editorRef = useRef(null);
	const style = background === null
		? {}
		: getBackgroundStyle(background, { isPreview: false });

	useEffect(() => {
		editorRef.current.focus();
	}, []);

	useEffect(() => {
		const text = editorState.getCurrentContent().getPlainText();
		const newLinesCount = (text.match(/\n/g) || []).length;
		if (text.length > 200 || newLinesCount > 5) {
			setCanApplyBackground(false);
		} else {
			setCanApplyBackground(true);
		}
	}, [ editorState ]);

	return (
		<Container style={{ ...style, color: background ? background.textColor : 'black', fontSize }} className={canApplyBackground ? 'draft-editor-container' : ''}>
			<Container className="draft-editor-inner-container">
				<Editor
					editorState={editorState}
					onChange={editorState => setEditorState(editorState)}
					textAlignment="center"
					ref={editorRef}
				/>
			</Container>
		</Container>
	);
}

export default UserPostEditor;
