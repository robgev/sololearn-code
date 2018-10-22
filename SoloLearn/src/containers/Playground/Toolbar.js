// React modules
import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { showError } from 'utils';
import omit from 'lodash/omit';

// i18n
import { translate } from 'react-i18next';

// Service
import Service from 'api/service';

// Material UI components
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
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
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			overflow: 'hidden',
		},

		hide: {
			display: 'none',
		},

		left: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			overflow: 'hidden',
		},

		right: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
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

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	avatarUrl: state.userProfile.avatarUrl,
	userName: state.userProfile.name,
});

@connect(mapStateToProps, null)
@translate()
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
		};
	}

	openSavePopup = () => {
		this.setState({ savePopupOpened: true });
	}

	handleSavePopupClose = () => {
		this.setState({
			savePopupOpened: false,
			codeName: '',
			errorText: '',
			isPublic: false,
		});
	}

	wrapCodeWithComment = () => {
		const { userCodeData: { userName, language } } = this.props;
		if (language === 'web') {
			const code =
				`<!-- Created by ${userName} -->

${this.props.code}
`;
			const cssCode =
				`/* Created by ${userName} */

${this.props.cssCode}
`;
			const jsCode =
				`// Created by ${userName}

${this.props.jsCode}
`;
			return {
				code,
				cssCode,
				jsCode,
			};
		}
		switch (language) {
		case 'cpp':
		case 'cs':
		case 'java':
		case 'php':
		{
			const code =
						`// Created by ${userName}

${this.props.code}
`;
			return { code };
		}
		case 'py':
		case 'rb':
		{
			const code =
						`# Created by ${userName}

${this.props.code}
`;
			return { code };
		}
		default:
			return null;
		}
	}

	generateSendData = (id) => {
		const { isPublic, codeName: name } = this.state;
		const { isUserCode, userCodeData: { userID }, userId } = this.props;
		const cleanedProps = omit(this.props, [ 'id', 'isUserCode' ]);
		if (isUserCode && userID !== userId) {
			const wrappedCode = this.wrapCodeWithComment();
			return {
				name,
				isPublic,
				...cleanedProps,
				...wrappedCode,
			};
		}
		return {
			name,
			isPublic,
			...cleanedProps,
		};
	}

	saveCodeInternal = (id) => {
		const sentData = this.generateSendData(id);
		const {
			userCodeData: { language }, name, code, cssCode, jsCode, isPublic,
		} = sentData;
		return Service.request('Playground/SaveCode', {
			id,
			language,
			name,
			code,
			cssCode,
			jsCode,
			isPublic,
		});
	}

	save = async () => {
		const {
			userId,
			isUserCode,
			userCodeData,
			setNewState,
		} = this.props;
		if (isUserCode && userCodeData.userID === userId) {
			this.setState({
				isSaving: true,
				snackBarOpened: true,
			});
			try {
				const res = await this.saveCodeInternal(userCodeData.id);
				this.setState({
					isSaving: false,
				}, () => {
					setNewState({
						latestSavedCodeData: {
							...res.code,
							codeType: 'userCode',
						},
					});
				});
			} catch (e) {
				showError(e, 'Something went wrong when trying to save');
			}
		} else {
			this.openSavePopup();
		}
	}

	submitSave = async () => {
		const {
			setNewState, avatarUrl, userName, showToolbar,
		} = this.props;
		if (this.state.codeName.trim()) {
			try {
				const res = await this.saveCodeInternal(0);
				setNewState({
					latestSavedCodeData: { ...res.code, avatarUrl, userName },
					id: res.code.id,
				}, () => {
					const { publicID, language } = res.code;
					const codeLanguage = language === 'web' ? 'html' : language; // Simple validation for the case, when the code is web.
					// this.handleInputsPopupClose();
					browserHistory.replace(`/playground/${publicID}/${codeLanguage}`);
					this.handleSavePopupClose();
					showToolbar();
				});
			} catch (e) {
				showError(e, 'Something went wrong when trying to save');
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

	addExternalSource = () => {
		const {
			mode, jsCode, handleEditorChange, insertToHead,
		} = this.props;
		const newSourceCode =
			insertToHead(`<script src="${this.state.sourceUrl}">
	${jsCode}
</script>\n`);
		if (mode === 'html') {
			handleEditorChange(newSourceCode);
		}
		this.handleExternalSourcesPopupClose();
	}

	handleSourceUrlChange = (e) => {
		this.setState({ sourceUrl: e.target.value });
	}

	handleExternalResourceChange = (e, index, selectedSource) => {
		const sourceUrl = selectedSource === 'none' ? '' : externalResources[selectedSource];
		this.setState({
			selectedSource,
			sourceUrl,
		});
	}

	checkDefaults = () => {
		// Apparently some clever people decided that it's a good idea to have
		// a big ass texts file where we can shove all the texts we have
		// without encapsulating different parts.
		// So we cannot do object.keys and we need to track the languages
		// we have here.
		const defaultKeys = [ 'c_cpp', 'java', 'php', 'html', 'python', 'csharp', 'ruby', 'swift', 'kotlin', 'c' ];
		const { code, mode } = this.props;
		// We go 1 by 1 on the possible languages and check if our code coincides
		// with those languages' default values, because on language change
		// we will always get the default codes. Now, if one of the default codes
		// coincides with the code we "wrote" we also need to check if the mode we currently are on
		// (the language we selected) is actually the language with which the code coincides
		// so it won't enable reset button if we write default html code in say cpp mode.
		// P.S. We should probably refactor this :/
		return defaultKeys.reduce((acc, currentKey) => acc || (texts[currentKey] === code && mode === currentKey), false);
	}

	determineResetButtonState = () => {
		const {
			code,
			mode,
			jsCode,
			cssCode,
			userCodeData,
		} = this.props;
		const isDefaultCode = this.checkDefaults();
		switch (mode) {
		case 'css':
			return userCodeData.cssCode === cssCode;
		case 'js':
		case 'javascript':
			return userCodeData.jsCode === jsCode;
		default:
			return userCodeData.sourceCode === code || isDefaultCode;
		}
	}

	render() {
		const {
			t,
			type,
			theme,
			inline,
			userId,
			runCode,
			isRunning,
			isUserCode,
			userCodeData,
			showWebOutput,
			languageSelector,
			resetEditorValue,
			handleThemeChange,
			handleLanguageChange,
		} = this.props;
		const {
			isSaving,
			sourceUrl,
			selectedSource,
			externalSourcesPopupOpened,
		} = this.state;
		return (
			<div id="toolbar" style={{ ...styles.toolbar.base, ...(showWebOutput ? styles.toolbar.hide : {}) }}>
				<div className="left" style={styles.toolbar.left}>
					{!inline && (
						<div>
							<DropDownMenu
								value={languageSelector}
								onChange={handleLanguageChange}
								style={styles.languageFilter}
								disabled={isUserCode && userCodeData.userID !== userId}
							>
								<MenuItem value="web" primaryText="HTML/CSS/JS" />
								<MenuItem value="c_cpp" primaryText="C++" />
								<MenuItem value="c" primaryText="C" />
								<MenuItem value="csharp" primaryText="C#" />
								<MenuItem value="java" primaryText="Java" />
								<MenuItem value="python" primaryText="Python 3" />
								<MenuItem value="php" primaryText="PHP" />
								<MenuItem value="ruby" primaryText="Ruby" />
								<MenuItem value="kotlin" primaryText="Kotlin" />
								<MenuItem value="swift" primaryText="Swift" />
							</DropDownMenu>
							<Checkbox
								labelPosition="left"
								style={styles.themeToggle}
								checked={theme === 'monokai'}
								iconStyle={styles.themeToggleIcon}
								onCheck={handleThemeChange}
								label={t('code_playground.dark-theme')}
							/>
						</div>
					)}
					{type === 'web' &&
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
						label={t('common.save-action-title')}
						disabled={isSaving}
						onClick={this.save}
						style={styles.codeAction.save}
					/>
					{!inline &&
						<FlatButton
							label={t('code_playground.actions.save-as')}
							disabled={isSaving}
							style={styles.codeAction.save}
							onClick={this.openSavePopup}
						/>
					}
					<FlatButton
						label={t('code_playground.actions.reset-code')}
						disabled={this.determineResetButtonState()}
						style={styles.codeAction.reset}
						onClick={resetEditorValue}
					/>
					<RaisedButton
						secondary
						label="Run"
						icon={<RunIcon />}
						onClick={runCode}
						labelPosition="before"
						style={styles.codeAction.run}
						disabled={isRunning || isSaving}
					/>
					<OverlaySaveActions
						{...this.state}
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

export default Toolbar;
