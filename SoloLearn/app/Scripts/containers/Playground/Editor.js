// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';

// Additional data and components (ACE Editor)
import brace from 'brace';
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
import texts from '../../defaults/texts';
import getStyles from '../../utils/styleConverter';

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

const aceEditorStyle = (<Style
	scopeSelector=".ace_editor"
	rules={{
		font: '12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace',
		div: {
			font: '12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace',
		},
	}}
/>);

const aceLineStyle = (<Style
	scopeSelector=".ace_line"
	rules={{
		font: '12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace',
		span: {
			font: '12px/normal \'Monaco\', \'Menlo\', \'Ubuntu Mono\', \'Consolas\', \'source-code-pro\', monospace',
		},
	}}
/>);

class Editor extends Component {
	aceEditor = null;

	// Add event listeners after component mounts and creacts ACE editor
	componentDidMount() {
		const node = findDOMNode(this.refs.editor);
		this.aceEditor = ace.edit(node);
		this.aceEditor.renderer.setScrollMargin(2, 0);
		// this.aceEditor.addEventListener('change', this.handleEditorChange);

		if (!this.props.gettingCode) {
			this.loadEditor();
		}
	}

	// Remove event listeners after component unmounts
	componentWillUnmount() {
		// this.aceEditor.removeEventListener('change', this.handleEditorChange);
	}
	// Load editor with requirements
	loadEditor = () => {
		const {
			theme, mode, sourceCode, isUserCode, isCodeTemplate,
		} = this.props;

		const sample = (!isUserCode && !isCodeTemplate) ? texts[mode] : sourceCode;
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

	// Change ACE Editor mode
	changeMode = (code) => {
		const editorMode = `ace/mode/${this.props.mode}`;
		this.aceEditor.session.setMode(editorMode);
		this.aceEditor.setValue(code, -1);

		const link = this.isUserCode ? `/playground/${this.userCodeData.publicID}/` : '/playground/';

		browserHistory.replace(link + editorSettings[this.state.mode].alias);
	}

	render() {
		return (
			<div>
				{aceEditorStyle}
				{aceLineStyle}
				<div id="editor" ref="editor" style={styles.editor.base} />
			</div>
		);
	}
}

export default Radium(Editor);
