// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { findKey } from 'lodash';

// Material UI components
import Paper from 'material-ui/Paper';

// Service
import Service from 'api/service';

// App defaults and utils
import texts from 'defaults/texts';
import editorSettings from 'defaults/playgroundEditorSettings';
import checkWeb from 'utils/checkWeb';

// Additional components
import Editor from './Editor';
import PlaygroundTabs from './PlaygroundTabs';
import Toolbar from './Toolbar';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

const styles = {
	playground: {
		base: {
			width: '1000px',
			margin: '20px auto 0',
			overflo: 'hidden',
		},

		hide: {
			display: 'none',
		},
	},
};

class Playground extends Component {
	constructor(props) {
		super(props);
		this.state = {
			code: '',
			jsCode: '',
			cssCode: '',
			type: 'web',
			codeType: '',
			publicID: '',
			mode: 'html',
			sourceCode: '',
			isSaving: false,
			isRunning: false,
			theme: 'monokai',
			showOutput: false,
			isGettingCode: false,
			latestSavedCodeData: {},
			languageSelector: 'web',
			userCodeLanguage: 'web',
		};
	}

	componentDidMount() {
		const customUserCodeHashLength = 12;
		const { params } = this.props;
		if (!params.primary && !params.secondary) {
			this.setDefaultSettings();
		} else if (params.primary.length !== customUserCodeHashLength) {
			// if first param is not auto-generated id with predefined length
			const isNumber = params.secondary ? params.secondary.match(/\d+/) : null;
			if (!isNumber) {
				const foundEditorSettingKey = findKey(editorSettings, { alias: params.primary });
				if (foundEditorSettingKey) {
					const { alias, type } = editorSettings[foundEditorSettingKey];
					const { html, css, javascript } = texts;
					const isWeb = checkWeb(alias);
					const codeData = {
						sourceCode: isWeb ? html : '',
						cssCode: isWeb ? css : '',
						jsCode: isWeb ? javascript : '',
						codeType: '',
						userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
					};
					const code = texts[foundEditorSettingKey];

					this.setState({
						type,
						code,
						...codeData,
						mode: foundEditorSettingKey,
						latestSavedCodeData: codeData,
						languageSelector: isWeb ? 'web' : foundEditorSettingKey,
					});

					browserHistory.replace(`/playground/${alias}`);
				} else {
					this.setDefaultSettings();
				}
			} else {
				this.getCodeTemplate();
			}
		} else {
			this.getUserCode();
		}
	}

	// Default settings
	setDefaultSettings = () => {
		const codeData = {
			sourceCode: '',
			cssCode: '',
			jsCode: '',
			codeType: '',
		};

		this.setState({
			type: 'web',
			...codeData,
			mode: 'html',
			theme: 'monokai',
			languageSelector: 'web',
			userCodeLanguage: 'web',
			latestSavedCodeData: codeData,
		});

		browserHistory.replace('/playground/html');
	}

	getCodeTemplate = async () => {
		const { params } = this.props;
		this.setState({ isGettingCode: true });
		try {
			const codeSample = await Service.request('Playground/GetCodeSample', { id: parseInt(params.secondary, 10) });
			const { sourceCode, cssCode, jsCode } = codeSample.code;
			const foundEditorSettingKey = findKey(editorSettings, { alias: params.primary });
			if (foundEditorSettingKey) {
				const { alias, type } = editorSettings[foundEditorSettingKey];
				const isWeb = checkWeb(alias);
				const codeData = {
					sourceCode,
					cssCode,
					jsCode,
					codeType: 'templateCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				};

				const latestSavedCodeData = {
					...codeSample.code,
					codeType: 'templateCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				}

				this.setState({
					type,
					...codeData,
					code: sourceCode,
					latestSavedCodeData,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'web' : foundEditorSettingKey,
				});

				browserHistory.replace(`/playground/${alias}/${params.secondary}`);
			} else {
				browserHistory.replace(`/playground/html/${params.secondary}`);
			}
			this.setState({ isGettingCode: false });
		} catch (error) {
			console.log(error);
		}
	}

	// Get user saved code
	getUserCode = async () => {
		const { params } = this.props;
		this.setState({ isGettingCode: true });

		// Link requires saved code
		try {
			const codeSample = await Service.request('Playground/GetCode', { publicId: params.primary });
			const {
				jsCode,
				cssCode,
				publicID,
				language,
				sourceCode,
			} = codeSample.code;
			// Check language of user code for setting up correct link
			const foundEditorSettingKey = findKey(editorSettings, { language });
			if (foundEditorSettingKey) {
				const { alias, type } = editorSettings[foundEditorSettingKey];
				browserHistory.replace(`/playground/${publicID}/${alias}`);
				const isWeb = checkWeb(alias);
				const codeData = {
					sourceCode,
					cssCode,
					jsCode,
					codeType: 'userCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				};

				const latestSavedCodeData = {
					...codeSample.code,
					codeType: 'userCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				}

				this.setState({
					type,
					publicID,
					...codeData,
					code: sourceCode,
					latestSavedCodeData,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'web' : foundEditorSettingKey,
				});
			}
			this.setState({ isGettingCode: false });
		} catch (error) {
			console.log(error);
		}
	}

	getTabCodeData = (mode, defaultCodeData) => {
		const { latestSavedCodeData = defaultCodeData } = this.state
		switch (mode) {
		case 'html':
		case 'php':
			return latestSavedCodeData.sourceCode;
		case 'css':
			return latestSavedCodeData.cssCode;
		default:
			return latestSavedCodeData.jsCode;
		}
	}

	// Change web tabs
	handleTabChange = (mode) => {
		const { params } = this.props;
		const code = this.getTabCodeData(mode);
		const { codeType, publicID } = this.state;
		const { alias } = editorSettings[mode];
		const isUserCode = codeType === 'userCode';
		const link = isUserCode ? `/playground/${publicID}/` : '/playground/';
		this.setState({
			code,
			mode,
			showOutput: false,
			languageSelector: 'web',
			userCodeLanguage: 'web',
		});
		browserHistory.replace(`${link}${alias}`);
	}

	handleEditorChange = (editorValue) => {
		const { mode } = this.state;
		switch (mode) {
		case 'css':
			this.setState({ code: editorValue, cssCode: editorValue });
			break;
		case 'javascript':
			this.setState({ code: editorValue, jsCode: editorValue });
			break;
		default:
			this.setState({ code: editorValue, sourceCode: editorValue });
			break;
		}
}

	handleLanguageChange = (e, index, selectedLanguage) => {
		const mode = selectedLanguage === 'web' ? 'html' : selectedLanguage;
		const { type, language } = editorSettings[mode];
		const { latestSavedCodeData, languageSelector, userCodeLanguage } = this.state;
		const isUserWritten =
			latestSavedCodeData.codeType === 'userCode' && language === userCodeLanguage;
		const code = isUserWritten ? latestSavedCodeData.sourceCode : texts[mode];
		this.setState({
			code,
			type,
			mode,
			showOutput: false,
			languageSelector: mode,
		});
	}

	handleThemeChange = (e, isInputChecked) => {
		const theme = isInputChecked ? 'monokai' : 'chrome';
		this.setState({ theme });
	}

	resetEditorValue = () => {
		const { mode, latestSavedCodeData, userCodeLanguage } = this.state;
		const { language } = editorSettings[mode];
		const {
			jsCode,
			cssCode,
			codeType,
			sourceCode,
		} = latestSavedCodeData;
		const userCodeOpened = codeType === 'userCode' && language === userCodeLanguage;
		const computedCssCode = userCodeOpened ? cssCode : texts[mode];
		const computedJsCode = userCodeOpened ? jsCode : texts[mode];
		const computedSourceCode = userCodeOpened ? sourceCode : texts[mode];
		switch (mode) {
		case 'css':
			this.setState({
				code: computedCssCode,
				cssCode: computedCssCode,
			});
			break;
		case 'javascript':
			this.setState({
				code: computedJsCode,
				jsCode: computedJsCode,
			});
			break;
		default:
			this.setState({
				code: computedSourceCode,
				sourceCode: computedSourceCode,
			});
			break;
		}
	}

	setLatestSavedData = (latestSavedCodeData) => {
		console.log(latestSavedCodeData);
		this.setState({
			latestSavedCodeData
		})
	}

	// TODO: Implement those functions
	// save
	//
	// handleExternalSourcesPopupOpen
	//
	// runCode

	render() {
		const {
			type,
			code,
			mode,
			theme,
			jsCode,
			cssCode,
			isSaving,
			publicID,
			codeType,
			isRunning,
			sourceCode,
			showOutput,
			isGettingCode,
			languageSelector,
			userCodeLanguage,
			latestSavedCodeData,
		} = this.state;
		const showWebOutput = (showOutput && (type === 'web' || type === 'combined'));

		return (
			isGettingCode ?
				<LoadingOverlay /> :
				<div id="playground-container">
					<Paper id="playground" style={styles.playground.base}>
						<PlaygroundTabs
							type={type}
							mode={mode}
							theme={theme}
							handleTabChange={this.handleTabChange}
						/>
						<Editor
							code={code}
							mode={mode}
							theme={theme}
							publicID={publicID}
							handleEditorChange={this.handleEditorChange}
						/>
						<Toolbar
							type={type}
							theme={theme}
							jsCode={jsCode}
							cssCode={cssCode}
							code={sourceCode}
							isSaving={isSaving}
							isRunning={isRunning}
							language={userCodeLanguage}
							showWebOutput={showWebOutput}
							isUserCode={codeType === 'userCode'}
							userCodeData={latestSavedCodeData}
							languageSelector={languageSelector}
							resetEditorValue={this.resetEditorValue}
							setLatestSavedData={this.setLatestSavedData}
							handleThemeChange={this.handleThemeChange}
							handleLanguageChange={this.handleLanguageChange}
						/>
					</Paper>
				</div>
		);
	}
}

export default Playground;
