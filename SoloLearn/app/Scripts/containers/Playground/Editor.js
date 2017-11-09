// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { browserHistory } from 'react-router';

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
import 'brace/theme/chrome'; // Editor light theme
import 'brace/theme/monokai'; // Editor dark theme
import 'brace/ext/language_tools';

// App defaults and utils
import texts from 'defaults/texts';

const styles = {
	editor: {
		base: {
			width: '100%',
			height: '500px',
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

class Editor extends Component {
	// Add event listeners after component mounts and creacts ACE editor
	componentDidMount() {
		const node = this.editor;
		this.aceEditor = ace.edit(node);
		this.aceEditor.renderer.setScrollMargin(2, 0);
		this.aceEditor.addEventListener('change', this.handleEditorChange);

		if (!this.props.gettingCode) {
			this.loadEditor();
		}
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		this.aceEditor.removeEventListener('change', this.handleEditorChange);
	}

	handleEditorChange = () => {
		const editorValue = this.aceEditor.getValue();
		this.props.handleEditorChange(editorValue);
	}

	// Load editor with requirements
	loadEditor = () => {
		const {
			mode,
			theme,
			codeType,
			sourceCode,
		} = this.props;

		const sample = !codeType ? texts[mode] : sourceCode;
		const editorMode = `ace/mode/${mode}`;
		const editorTheme = `ace/theme/${theme}`;

		this.aceEditor.session.setMode(editorMode);
		this.aceEditor.$blockScrolling = Infinity;
		this.aceEditor.setTheme(editorTheme);
		this.aceEditor.setValue(sample, -1);
		this.aceEditor.session.setUseWrapMode(true);
		this.aceEditor.session.setUndoManager(new ace.UndoManager());
		this.aceEditor.setOptions({
			mode: editorMode,
			enableBasicAutocompletion: true,
			showPrintMargin: false,
		});
	}

	componentDidUpdate(prevProps) {
		const { mode, codeType, alias, code } = this.props;
		const { mode: lastKnownMode } = prevProps
		if (lastKnownMode !== mode) {
			const editorMode = `ace/mode/${mode}`;
			const isUserCode = codeType === 'userCode';
			const link = isUserCode ? `/playground/${this.userCodeData.publicID}/` : '/playground/';

			this.aceEditor.session.setMode(editorMode);
			this.aceEditor.setValue(code, -1);
			browserHistory.replace(`${link}${alias}`);
		}
	}

	render() {
		return (
			<div>
				{aceEditorStyle}
				{aceLineStyle}
				<div id="editor" ref={(editor) => { this.editor = editor; }} style={styles.editor.base} />
			</div>
		);
	}
}

export default Radium(Editor);
