// React modules
import React, { Component } from 'react';

// Material UI components
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import RunIcon from 'material-ui/svg-icons/av/play-arrow';
import InsertLink from 'material-ui/svg-icons/editor/insert-link';

const styles = {
	toolbar: {
		base: {
			display: 'block',
			overflow: 'hidden',
		},

		hide: {
			display: 'none',
		},

		left: {
			float: 'left',
			overflow: 'hidden',
		},

		right: {
			float: 'right',
		},
	},

	languageFilter: {
		padding: '0 10px 10px 0',
		float: 'left',
		width: '200px',
	},

	themeToggle: {
		float: 'left',
		width: '150px',
		margin: '20px 0 0 0',
	},

	themeToggleIcon: {
		fill: '#AED581',
	},

	codeAction: {
		save: {
			margin: '15px 0',
		},

		reset: {
			margin: '15px 0',
		},

		run: {
			margin: '15px 10px',
		},
	},
};

class Toolbar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			showWebOutput, languageSelector, theme, type, isSaving, isRunning,
		} = this.props;

		return (
			<div id="toolbar" style={!showWebOutput ? styles.toolbar.base : getStyles(styles.toolbar.base, styles.toolbar.hide)}>
				<div className="left" style={styles.toolbar.left}>
					<DropDownMenu value={languageSelector} onChange={this.handleLanguageChange} style={styles.languageFilter}>
						<MenuItem value="html" primaryText="HTML/CSS/JS" />
						<MenuItem value="c_cpp" primaryText="C++" />
						<MenuItem value="csharp" primaryText="C#" />
						<MenuItem value="java" primaryText="Java" />
						<MenuItem value="python" primaryText="Python 3" />
						<MenuItem value="php" primaryText="PHP" />
						<MenuItem value="ruby" primaryText="Ruby" />
					</DropDownMenu>
					<Checkbox
						label="Dark Theme"
						labelPosition="left"
						checked={theme == 'monokai'}
						style={styles.themeToggle}
						iconStyle={styles.themeToggleIcon}
						onCheck={this.handleThemeChange}
					/>
					{type == 'web' && <FlatButton label="External Resources" labelPosition="before" style={styles.codeAction.run} icon={<InsertLink />} onClick={this.handleExternalSourcesPopupOpen} />}
				</div>
				<div className="right" style={styles.toolbar.right}>
					<FlatButton label="Save" style={styles.codeAction.save} default={!isSaving} disabled={isSaving} onClick={() => { this.save(false); }} />
					<FlatButton label="Save As" style={styles.codeAction.save} default={!isSaving} disabled={isSaving} onClick={() => { this.save(true); }} />
					<FlatButton label="Reset" style={styles.codeAction.reset} onClick={this.resetEditorValue} />
					<RaisedButton label="Run" labelPosition="before" style={styles.codeAction.run} secondary={!isRunning && !this.isSaving} disabled={isRunning || isSaving} icon={<RunIcon />} onClick={this.runCode} />
				</div>
			</div>
		);
	}
}

export default Toolbar;
