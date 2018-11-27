import React from 'react';
import { observer } from 'mobx-react';
import AceEditor from 'react-ace';
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

import { editorModeNames } from 'containers/Playground/utils/Mappings';
import './styles.scss';

const Editor = ({
	playground: {
		code,
		isDark,
		publicId,
		language,
		isFullscreen,
		changeEditorState,
	},
}) => (
	<AceEditor
		wrapEnabled
		value={code}
		width="100%"
		height={isFullscreen ? '100%' : '500px'}
		showPrintMargin={false}
		theme={isDark ? 'monokai' : 'chrome'}
		mode={editorModeNames[language]}
		setOptions={{
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			enableSnippets: false,
			showLineNumbers: true,
			tabSize: 2,
		}}
		name={publicId}
		onChange={changeEditorState}
		editorProps={{ $blockScrolling: Infinity }}
		onLoad={(editor) => {
			editor.focus();
			editor.getSession().setUseWrapMode(true);
			editor.getSession().setUndoManager(new ace.UndoManager());
		}}
	/>
);

export default observer(Editor);
