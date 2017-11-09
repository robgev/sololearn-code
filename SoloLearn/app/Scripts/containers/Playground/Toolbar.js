// React modules
import React from 'react';

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

const Toolbar = ({
	save,
	type,
	theme,
	runCode,
	isSaving,
	isRunning,
	showWebOutput,
	languageSelector,
	resetEditorValue,
	handleThemeChange,
	handleLanguageChange,
	handleExternalSourcesPopupOpen,
}) => (
	<div id="toolbar" style={{ ...styles.toolbar.base, ...(showWebOutput ? styles.toolbar.hide : {}) }}>
		<div className="left" style={styles.toolbar.left}>
			<DropDownMenu
				value={languageSelector}
				onChange={handleLanguageChange}
				style={styles.languageFilter}
			>
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
				style={styles.themeToggle}
				checked={theme === 'monokai'}
				iconStyle={styles.themeToggleIcon}
				onCheck={handleThemeChange}
			/>
			{	type === 'web' &&
				<FlatButton
					icon={<InsertLink />}
					labelPosition="before"
					label="External Resources"
					style={styles.codeAction.run}
					onClick={handleExternalSourcesPopupOpen}
				/>
			}
		</div>
		<div className="right" style={styles.toolbar.right}>
			<FlatButton
				label="Save"
				disabled={isSaving}
				default={!isSaving}
				onClick={() => save(false)}
				style={styles.codeAction.save}
			/>
			<FlatButton
				label="Save As"
				disabled={isSaving}
				default={!isSaving}
				onClick={() => save(true)}
				style={styles.codeAction.save}
			/>
			<FlatButton
				label="Reset"
				style={styles.codeAction.reset}
				onClick={resetEditorValue}
			/>
			<RaisedButton
				label="Run"
				icon={<RunIcon />}
				labelPosition="before"
				onClick={runCode}
				style={styles.codeAction.run}
				disabled={isRunning || isSaving}
				secondary={!isRunning && !isSaving}
			/>
		</div>
	</div>
);

export default Toolbar;
