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
			type: 'web',
			publicID: '',
			codeData: {},
			mode: 'html',
			isSaving: false,
			isRunning: false,
			theme: 'monokai',
			showOutput: false,
			isGettingCode: false,
			codeLanguage: 'html',
			languageSelector: 'html',
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
					};

					this.setState({
						type,
						codeData,
						mode: foundEditorSettingKey,
						languageSelector: isWeb ? 'html' : foundEditorSettingKey,
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
			codeData,
			type: 'web',
			mode: 'html',
			theme: 'monokai',
			languageSelector: 'html',
		});

		browserHistory.replace('/playground/html');
	}

	getCodeTemplate = async () => {
		const { params } = this.props;
		this.setState({ isGettingCode: true });
		try {
			const codeSample = await Service.request('Playground/GetCodeSample', { id: parseInt(params.secondary, 10) });
			const { sourceCode, cssCode, jsCode } = codeSample.code;
			const codeData = {
				sourceCode,
				cssCode,
				jsCode,
				codeType: 'templateCode',
			};
			const foundEditorSettingKey = findKey(editorSettings, { alias: params.primary });
			if (foundEditorSettingKey) {
				const { alias, type } = editorSettings[foundEditorSettingKey];
				const isWeb = checkWeb(alias);

				this.setState({
					type,
					codeData,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'html' : foundEditorSettingKey,
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
			const codeData = {
				sourceCode,
				cssCode,
				jsCode,
				codeType: 'userCode',
			};
			// Check language of user code for setting up correct link
			const foundEditorSettingKey = findKey(editorSettings, { language });
			if (foundEditorSettingKey) {
				const { alias, type } = editorSettings[foundEditorSettingKey];
				browserHistory.replace(`/playground/${publicID}/${alias}`);
				const isWeb = checkWeb(alias);
				this.setState({
					type,
					publicID,
					codeData,
					code: sourceCode,
					codeLanguage: language,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'html' : foundEditorSettingKey,
				});
			}
			this.setState({ isGettingCode: false });
		} catch (error) {
			console.log(error);
		}
	}

	getTabCodeData = (mode) => {
		const { codeData } = this.state;
		switch (mode) {
		case 'html':
		case 'php':
			return codeData.sourceCode;
		case 'css':
			return codeData.cssCode;
		default:
			return codeData.jsCode;
		}
	}

	// Change web tabs
	handleTabChange = (mode) => {
		const code = this.getTabCodeData(mode);
		const { codeData: { codeType }, publicID } = this.state;
		const { alias } = editorSettings[mode];
		const isUserCode = codeType === 'userCode';
		const link = isUserCode ? `/playground/${publicID}/` : '/playground/';
		this.setState({
			code,
			mode,
			showOutput: false,
			languageSelector: 'html',
		});
		browserHistory.replace(`${link}${alias}`);
	}

	handleEditorChange = (editorValue) => {
		const { type, mode, codeData } = this.state;
		if (type === 'web') {
			switch (mode) {
			case 'html':
				this.setState({ code: editorValue, codeData: { ...codeData, sourceCode: editorValue } });
				break;
			case 'css':
				this.setState({ code: editorValue, codeData: { ...codeData, cssCode: editorValue } });
				break;
			case 'javascript':
				this.setState({ code: editorValue, codeData: { ...codeData, jsCode: editorValue } });
				break;
			default:
				break;
			}
		} else {
			const newSourceCodeData = { ...codeData, sourceCode: editorValue };
			this.setState({ code: editorValue, codeData: newSourceCodeData });
		}
	}

	handleLanguageChange = (e, index, mode) => {
		const { type, language } = editorSettings[mode];
		const { codeData, codeLanguage } = this.state;
		const isUserWritten = codeData.codeType === 'userCode' && language === codeLanguage;
		const code = isUserWritten ? codeData.sourceCode : texts[mode];
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
		const { mode, codeData, languageSelector } = this.state;
		const { language } = editorSettings[mode];
		const {
			jsCode,
			cssCode,
			codeType,
			sourceCode,
		} = codeData;
		const userCodeOpened = codeType === 'userCode' && language === languageSelector;
		const computedCssCode = userCodeOpened ? cssCode : texts[mode];
		const computedJsCode = userCodeOpened ? jsCode : texts[mode];
		const computedSourceCode = userCodeOpened ? sourceCode : texts[mode];
		switch (mode) {
		case 'css':
			this.setState({
				code: computedCssCode,
				codeData: { ...codeData, computedCssCode },
			});
			break;
		case 'javascript':
			this.setState({
				code: computedJsCode,
				codeData: { ...codeData, computedJsCode },
			});
			break;
		default:
			this.setState({
				code: computedSourceCode,
				codeData: { ...codeData, computedSourceCode },
			});
			break;
		}
	}

	// TODO: Implement those functions
	// TODO: Add new state object, lastSavedCodeData, it changes only on save and
	// is set on intialization
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
			isSaving,
			codeData,
			isRunning,
			showOutput,
			isGettingCode,
			languageSelector,
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
							userCodeData={codeData}
							handleEditorChange={this.handleEditorChange}
						/>
						<Toolbar
							type={type}
							theme={theme}
							isSaving={isSaving}
							isRunning={isRunning}
							showWebOutput={showWebOutput}
							languageSelector={languageSelector}
							handleThemeChange={this.handleThemeChange}
							handleLanguageChange={this.handleLanguageChange}
						/>
					</Paper>
				</div>
		);
	}
}

export default Playground;
