// React modules
import React from 'react';
import AceEditor from 'react-ace';
import 'styles/Playground/Editor.scss';

// Additional data and components (ACE Editor)
import ace from 'brace';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/csharp';
import 'brace/mode/ruby';
import 'brace/mode/kotlin';
import 'brace/mode/swift';
import 'brace/theme/chrome'; // Editor light theme
import 'brace/theme/monokai'; // Editor dark theme
import 'brace/ext/language_tools';

const styles = {
	editor: {
		base: {
			width: '100%',
			height: '100%',
			transform: 'translateZ(0)',
		},
		hide: {
			display: 'none',
		},
	},
};

const Editor = ({
	code,
	mode,
	theme,
	publicID,
	showWebOutput,
	handleEditorChange,
}) => (
	<AceEditor
		wrapEnabled
		value={code}
		width="100%"
		theme={theme}
		showPrintMargin={false}
		mode={mode !== 'c' ? mode : 'c_cpp'}
		setOptions={{
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			enableSnippets: false,
			showLineNumbers: true,
			tabSize: 2,
		}}
		name={publicID}
		onChange={handleEditorChange}
		editorProps={{ $blockScrolling: Infinity }}
		onLoad={(editor) => {
			editor.focus();
			editor.getSession().setUseWrapMode(true);
			editor.getSession().setUndoManager(new ace.UndoManager());
		}}
		style={{
			...styles.editor.base,
			...(showWebOutput ? styles.editor.hide : {}),
		}}
	/>
);

export default Editor;
