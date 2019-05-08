import React, { useState, useEffect, useRef } from 'react';
import { Editor, EditorState } from 'draft-js';
import { Container, FlexBox } from 'components/atoms';
import { getBackgroundStyle, getFontSize } from '../utils';

import './styles.scss';

const DraftEditor = ({
	background,
	setEditorHasText,
	setEditorText,
}) => {
	const [ editorState, setEditorState ] = useState(EditorState.createEmpty());
	const [ fontSize, setFontSize ] = useState(36);

	const editorRef = useRef(null);
	const style = background === null
		? {}
		: getBackgroundStyle(background, { isPreview: false });

	useEffect(() => {
		editorRef.current.focus();
	}, []);

	useEffect(() => {
		editorRef.current.focus();
	}, [ background ]);

	useEffect(() => {
		const currentContent = editorState.getCurrentContent();
		setEditorHasText(currentContent.hasText());
		const text = currentContent.getPlainText();
		setEditorText(text);
		const newLinesCount = (text.match(/\n/g) || []).length;
		setFontSize(getFontSize(text.length, newLinesCount));
	}, [ editorState ]);

	return (
		<FlexBox
			align={background ? background.type !== 'none' && true : false}
			justify={background ? background.type !== 'none' && true : false}
			style={background.type !== 'none' ?
				{ ...style, color: background ? background.textColor : 'black', fontSize }
				:
				{ color: background ? background.textColor : 'black', fontSize }
			}
			className="draft-editor-container"
			onClick={() => { editorRef.current.focus(); }}
		>
			<Container className="draft-editor-inner-container">
				<Editor
					editorState={editorState}
					onChange={editorState => setEditorState(editorState)}
					textAlignment={background ? background.type !== 'none' && 'center' : 'left'}
					ref={editorRef}
				/>
			</Container>
		</FlexBox>
	);
};

export default DraftEditor;
