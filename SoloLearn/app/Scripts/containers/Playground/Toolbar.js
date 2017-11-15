// React modules
import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { omit } from 'lodash';

// Service
import Service from 'api/service';

// Material UI components
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import RunIcon from 'material-ui/svg-icons/av/play-arrow';
import InsertLink from 'material-ui/svg-icons/editor/insert-link';

// Defaults
import texts from 'defaults/texts';
import externalResources from 'defaults/externalResources';

// Components
import OverlaySaveActions from './OverlaySaveActions';
import OverlayExecutionActions from './OverlayExecutionActions';

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

class Toolbar extends PureComponent {
	constructor() {
		super();
		this.state = {
			sourceUrl: '',
			errorText: '',
			codeName: '',
			isPublic: false,
			isSaving: false,
			selectedSource: 'none',
			snackBarOpened: false,
			savePopupOpened: false,
			externalSourcesPopupOpened: false,
		}
	}

	openSavePopup = () => {
		this.setState({ savePopupOpened: true });
	}

	handleSavePopupClose = () => {
		this.setState({
				savePopupOpened: false,
				codeName: '',
				errorText: '',
				isPublic: false
		});
	}

	saveCodeInternal =  id => {
		const { isPublic, codeName: name } = this.state;
		const cleanedProps = omit(this.props, [ 'id', 'isUserCode' ])
		const sendData = {
			id,
			name,
			isPublic,
			...cleanedProps,
		}
		return Service.request("Playground/SaveCode", sendData);
	}

	save = async () => {
		const {
			userId,
			isUserCode,
			userCodeData,
			setLatestSavedData,
		} = this.props;
		if (isUserCode && userCodeData.userID === userId) {
			this.setState({
				isSaving: true,
				snackBarOpened: true
			});
			try {
				const { code } = await this.saveCodeInternal(userCodeData.id);
				setLatestSavedData({
					...code,
					codeType: 'userCode',
				});
				this.setState({
					isSaving: false,
				});
			} catch (error) {
				console.log(error);
			};
		} else {
				this.openSavePopup();
		}
	}

	submitSave = async () => {
			if (this.state.codeName.trim()) {
				try {
					const { code } = await this.saveCodeInternal(0);
					setLatestSavedData(code);
					const { publicID, language } = code;
					// this.handleInputsPopupClose();
					browserHistory.replace(`/playground/${publicID}/${language}`);
				} catch (error) {
					console.log(error);
				}
			} else {
				this.setState({ errorText: texts.codeNameError });
			}
	}

	handleCodeNameChange = (e) => {
		const errorText = e.target.value.length === 0 ? texts.codeNameError : '';
		this.setState({
			errorText,
			codeName: e.target.value,
		});
	}

	handleCodeStateChange = (e, isInputChecked) => {
		this.setState({ isPublic: isInputChecked });
	}

	handleSnackBarClose = (reason) => {
		if (reason !== 'clickaway') {
			this.setState({ snackBarOpened: false });
		}
	}

	handleExternalSourcesPopupOpen = () => {
		this.setState({ externalSourcesPopupOpened: true });
	}

	handleExternalSourcesPopupClose = () => {
		this.setState({
			externalSourcesPopupOpened: false,
			selectedSource: 'none',
			sourceUrl: '',
		});
	}

	wrapByTag = (code, tag) => {
		const hasTag = code.includes(tag);
		if (!hasTag) {
			return (
`<${tag}>
	${code}
</${tag}>`
			);
		}
		return code;
	}

	addResourceValueAfterTag = (code, value, tag) => {
		const tagOpeningPosition = code.indexOf(tag);
		// Closing bracket and newline make 2;
		const insertPosition = tagOpeningPosition + tag.length + 2;
		const precedingSubstr = code.slice(0, insertPosition);
		const succeedingSubstr = code.slice(insertPosition);
		return (
`${precedingSubstr}
	${value}
${succeedingSubstr}
`
		);
	}

	wrapAndAdd = (code, value) => {
		const hasTag = code.includes('head');
		const wrappedCode = this.wrapByTag(code, 'html');
		const headWrappedValue =
`<head>
${value}
</head>
`
		const codeToBeAdded = hasTag ? value : headWrappedValue;
		const tagToBeAddedAfter = hasTag ? '<head' : '<html'
		return this.addResourceValueAfterTag(wrappedCode, codeToBeAdded, tagToBeAddedAfter);
	}


	insertToHead = (value) => {
		const { code, setSourceCode } = this.props;
		const clearedCode = this.wrapAndAdd(code, value);
		return clearedCode;
	}

	addExternalSource = () => {
		const { mode, jsCode, handleEditorChange } = this.props;
		const newSourceCode =
			this.insertToHead(
`<script src="${this.state.sourceUrl}">
	${jsCode}
</script>\n`
			);
		if (mode === 'html') {
			handleEditorChange(newSourceCode)
		}
		this.handleExternalSourcesPopupClose();
	}

	handleSourceUrlChange = (e) => {
		this.setState({ sourceUrl: e.target.value });
	}

	handleExternalResourceChange = (e, index, selectedSource)  => {
		const sourceUrl = selectedSource === 'none' ? '' : externalResources[selectedSource];
		this.setState({
			selectedSource,
			sourceUrl,
		});
	}

	render() {
		const {
			id,
			save,
			type,
			code,
			theme,
			jsCode,
			cssCode,
			runCode,
			isSaving,
			language,
			isRunning,
			isUserCode,
			showWebOutput,
			languageSelector,
			resetEditorValue,
			handleThemeChange,
			handleSavePopupOpen,
			handleLanguageChange,
		} = this.props;
		const {
			sourceUrl,
			selectedSource,
			externalSourcesPopupOpened,
		} = this.state;
		return (
			<div id="toolbar" style={{ ...styles.toolbar.base, ...(showWebOutput ? styles.toolbar.hide : {}) }}>
				<div className="left" style={styles.toolbar.left}>
					<DropDownMenu
						value={languageSelector}
						onChange={handleLanguageChange}
						style={styles.languageFilter}
					>
						<MenuItem value="web" primaryText="HTML/CSS/JS" />
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
							onClick={this.handleExternalSourcesPopupOpen}
						/>
					}
				</div>
				<div className="right" style={styles.toolbar.right}>
					<FlatButton
						label="Save"
						disabled={isSaving}
						default={!isSaving}
						onClick={this.save}
						style={styles.codeAction.save}
					/>
					<FlatButton
						label="Save As"
						disabled={isSaving}
						default={!isSaving}
						style={styles.codeAction.save}
						onClick={this.openSavePopup}
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
					<OverlaySaveActions
						{...this.state}
						save={this.save}
						submitSave={this.submitSave}
						openSavePopup={this.openSavePopup}
						handleSnackBarClose={this.handleSnackBarClose}
						handleSavePopupClose={this.handleSavePopupClose}
						handleCodeStateChange={this.handleCodeStateChange}
						handleCodeNameChange={this.handleCodeNameChange}
					/>
					<OverlayExecutionActions
						sourceUrl={sourceUrl}
						selectedSource={selectedSource}
						insertToHead={this.insertToHead}
						addExternalSource={this.addExternalSource}
						handleSourceUrlChange={this.handleSourceUrlChange}
						externalSourcesPopupOpened={externalSourcesPopupOpened}
						handleExternalResourceChange={this.handleExternalResourceChange}
						handleExternalSourcesPopupClose={this.handleExternalSourcesPopupClose}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	userId: state.userProfile.id,
});

export default connect(mapStateToProps, null)(Toolbar);
