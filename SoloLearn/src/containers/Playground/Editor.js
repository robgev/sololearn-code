// React modules
import React, { Fragment } from 'react';
import Radium, { Style } from 'radium';
import AceEditor from 'react-ace';

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

const defaultFontRule =
	'12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace';

const aceEditorStyle = (
	<Style
		scopeSelector=".ace_editor"
		rules={{
			font: defaultFontRule,
			div: {
				font: defaultFontRule,
			},
		}}
	/>
);

const aceLineStyle = (
	<Style
		scopeSelector=".ace_line"
		rules={{
			font: defaultFontRule,
			span: {
				font: defaultFontRule,
			},
		}}
	/>
);

const Editor = ({
	code,
	mode,
	theme,
	inline,
	publicID,
	fullScreen,
	showWebOutput,
	handleEditorChange,
}) => (
	<Fragment>
		{aceEditorStyle}
		{aceLineStyle}
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
	</Fragment>
);

export default Radium(Editor);
