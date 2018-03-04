// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { findKey } from 'lodash';

// i18n
import { translate } from 'react-i18next';

// Material UI components
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

// Redux loaded
import { isLoaded } from 'reducers';

// Service
import Service from 'api/service';

// App defaults and utils
import texts from 'defaults/texts';
import inputRegexes from 'defaults/inputRegexes';
import editorSettings from 'defaults/playgroundEditorSettings';
import { checkWeb } from 'utils';

// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Editor from './Editor';
import PlaygroundTabs from './PlaygroundTabs';
import Toolbar from './Toolbar';
import Comments from '../Comments/CommentsBase';
import OutputWindow from './OutputWindow';
import BottomToolbar from './BottomToolbar';

const styles = {
	playground: {
		base: {
			width: '100%',
			maxWidth: '1000px',
			margin: '20px auto 0',
			overflo: 'hidden',
		},
		hide: {
			display: 'none',
		},
	},
	defaultOutputContainer: {
		base: {
			position: 'relative',
			width: '100%',
			minHeight: '200px',
			margin: '20px auto',
			display: 'none',
		},
		show: {
			display: 'block',
		},
		defaultOutput: {
			padding: '10px',
		},
		outputHeader: {
			borderBottom: '1px solid #dedede',
			padding: '10px',
			fontSize: '17px',
			fontWeight: '500',
		},
	},
};

const mapStateToProps = state => ({
	commentSelected: isLoaded(state, 'commentSelected'),
});

@connect(mapStateToProps)
class Playground extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: 0,
			code: '',
			jsCode: '',
			inputs: '',
			cssCode: '',
			type: 'web',
			codeType: '',
			publicID: '',
			mode: 'html',
			sourceCode: '',
			isRunning: false,
			theme: 'monokai',
			showOutput: false,
			isGettingCode: true,
			latestSavedCodeData: {},
			languageSelector: 'web',
			userCodeLanguage: 'web',
			shouldShowToolbar: false,
			inputsPopupOpened: false,
			commentsOpened: props.commentSelected,
		};
	}

	componentDidMount() {
		const customUserCodeHashLength = 12;
		const { params, basePath } = this.props;
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
						isGettingCode: false,
						mode: foundEditorSettingKey,
						latestSavedCodeData: codeData,
						languageSelector: isWeb ? 'web' : foundEditorSettingKey,
					});

					browserHistory.replace(`${basePath}/${alias}`);
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

	componentWillReceiveProps(newProps) {
		if (newProps.commentSelected) this.openComments();
	}

	// Default settings
	setDefaultSettings = () => {
		const { basePath } = this.props;
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
			isGettingCode: false,
			languageSelector: 'web',
			userCodeLanguage: 'web',
			latestSavedCodeData: codeData,
		});

		browserHistory.replace(`${basePath}/html`);
	}

	getCodeTemplate = async () => {
		const { params, basePath } = this.props;
		this.setState({ isGettingCode: true });
		try {
			const id = parseInt(params.secondary, 10);
			const { code } = await Service.request('Playground/GetCodeSample', { id });
			const { sourceCode, cssCode, jsCode } = code;
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
					...code,
					codeType: 'templateCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				};
				const editorCode = this.getTabCodeData(alias, code);
				this.setState({
					type,
					...codeData,
					code: editorCode,
					latestSavedCodeData,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'web' : foundEditorSettingKey,
				});

				browserHistory.replace(`${basePath}/${alias}/${params.secondary}`);
			} else {
				browserHistory.replace(`${basePath}/html/${params.secondary}`);
			}
			this.setState({ isGettingCode: false });
		} catch (error) {
			console.log(error);
		}
	}

	// Get user saved code
	getUserCode = async () => {
		const { params, basePath } = this.props;
		this.setState({ isGettingCode: true });

		// Link requires saved code
		try {
			const { code } = await Service.request('Playground/GetCode', { publicId: params.primary });
			const {
				id,
				jsCode,
				cssCode,
				publicID,
				language,
				sourceCode,
			} = code;
			// Check language of user code for setting up correct link
			const foundEditorSettingKey = params.secondary ?
				findKey(editorSettings, { language, alias: params.secondary }) :
				findKey(editorSettings, { language });
			if (foundEditorSettingKey) {
				const { alias, type } = editorSettings[foundEditorSettingKey];
				if (!params.secondary) { // if the language/tab is not specified
					browserHistory.replace(`${basePath}/${publicID}/${alias}`);
				}
				const isWeb = checkWeb(alias);
				const codeData = {
					sourceCode,
					cssCode,
					jsCode,
					codeType: 'userCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				};

				const latestSavedCodeData = {
					...code,
					codeType: 'userCode',
					userCodeLanguage: isWeb ? 'web' : foundEditorSettingKey,
				};

				this.setState({
					id,
					type,
					publicID,
					...codeData,
					latestSavedCodeData,
					shouldShowToolbar: true,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'web' : foundEditorSettingKey,
					code: this.getTabCodeData(foundEditorSettingKey, codeData),
				});
			}
			this.setState({ isGettingCode: false });
		} catch (error) {
			console.log(error);
		}
	}

	getTabCodeData = (mode, codes) => {
		const { sourceCode, cssCode, jsCode } = codes || this.state;
		switch (mode) {
		case 'html':
		case 'php':
			return sourceCode;
		case 'css':
			return cssCode;
		case 'js':
		case 'javascript':
			return jsCode;
		default:
			return sourceCode;
		}
	}

	// Change web tabs
	handleTabChange = (mode) => {
		const { basePath } = this.props;
		const code = this.getTabCodeData(mode);
		const { codeType, publicID } = this.state;
		const { alias } = editorSettings[mode];
		const isUserCode = codeType === 'userCode';
		const link = isUserCode ? `${basePath}/${publicID}/` : `${basePath}/`;
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
		const { latestSavedCodeData, userCodeLanguage } = this.state;
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
			latestSavedCodeData,
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
</head >
						`;
		const codeToBeAdded = hasTag ? value : headWrappedValue;
		const tagToBeAddedAfter = hasTag ? '<head' : '<html';
		return this.addResourceValueAfterTag(wrappedCode, codeToBeAdded, tagToBeAddedAfter);
	}

	insertToHead = (value) => {
		const { sourceCode } = this.state;
		return this.wrapAndAdd(sourceCode, value);
	}

	getStructurizeWebCode() {
		const { cssCode, jsCode } = this.state;
		return this.insertToHead(`<style>${cssCode}</style><script>${jsCode}</script>`);
	}

	// TODO: Implement those functions
	// runCode

	// Clear output
	clearOutput = () => {
		document.querySelector('.default-output').innerHTML = '';
		document.querySelector('#js-console .error-message').innerHTML = '';
		document.querySelector('#js-console .log-message').innerHTML = '';
	}

	compileCode = (sourceCode, language, input) => Service.request('Playground/CompileCode', { code: sourceCode, language, input })

	// Show output
	showOutput = (language, output) => {
		const { t } = this.props;
		if (language === 'web') {
			const frame = document.getElementById('output-frame');
			const iWindow = frame.contentWindow;

			iWindow.console.log = () => {
				let consoleOutput = '';
				for (let i = 0; i < arguments.length; i++) {
					const current = arguments[i];
					if (typeof current === 'string' || typeof current === 'number' || typeof current === 'boolean') { consoleOutput += `${arguments[i]} `; }
				}

				const outputHTML = consoleOutput.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
				const logMessage = document.querySelector('#js-console .log-message');
				logMessage.append(outputHTML);
			};

			const innerScript = 'window.onerror = function (msg, url, line, col, error) {' +
				'var lineText = line == 0 ? "" : "<br /><span>Line: " + (line) + "</span>";' +
				'var errorMessage = msg + lineText;' +
				'window.parent.document.querySelector("#js-console .error-message").innerHTML = errorMessage;' +
				'return false;' +
				'}';

			const iDoc = frame.contentDocument;

			iDoc.write(`<script>${innerScript}</script>`);

			iDoc.write(output);
			iDoc.close();
		} else if (language === 'php') {
			const frame = document.getElementById('output-frame');
			const iDoc = frame.contentDocument;
			iDoc.write(output);
			iDoc.close();
		} else {
			output = output.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			const message = output !== '' ? output : t('code_playground.no-output');

			document.querySelector('.default-output').innerHTML = message;
		}

		this.setState({ isRunning: false });
	}

	checkForInput = (language) => {
		const { sourceCode } = this.state;
		// Doing some work with source code...
		if (language === 'python') {
			const codeBlock = sourceCode.replace(/(([^'"])(#)|(^#))((.*)$)/gm, ''); // $2
			const inputRegex = inputRegexes[language];
			return inputRegex.test(codeBlock);
		} else if (language === 'ruby') {
			const codeBlock = sourceCode.replace(/(=begin(\n[\s\S]*?)=end)|(([^'"])(#)|(^#))((.*)$)/gm, '');
			const inputRegex = inputRegexes[language];
			return inputRegex.test(codeBlock);
		}

		const codeBlock = sourceCode.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
		const inputRegex = inputRegexes[language];
		return inputRegex.test(codeBlock);
	}

	runCode = async () => {
		const {
			type,
			sourceCode,
			languageSelector: language,
		} = this.state;

		this.clearOutput();

		if (type === 'web') {
			this.setState({
				showOutput: true,
				isRunning: true,
				mode: null,
			});

			const response = this.getStructurizeWebCode();

			// Save compiled data
			this.compileCode(response, language, '');
			// Show output
			this.showOutput(language, response);
		} else if (type === 'combined') {
			this.setState({
				showOutput: true,
				isRunning: true,
				mode: null,
			});

			// Save compiled data
			const compiledCode = await this.compileCode(sourceCode, language, '');
			// Show output
			this.showOutput(language, compiledCode.output);
		} else if (this.checkForInput(language)) {
			this.setState({ inputsPopupOpened: true });
		} else {
			this.setState({
				showOutput: true,
				isRunning: true,
			});

			// Save compiled data
			const compiledCode = await this.compileCode(sourceCode, language, '');
			// Show output
			this.showOutput(language, compiledCode.output);
		}
	}

	runCondeWithInputs = async () => {
		const {
			inputs,
			sourceCode,
			languageSelector: language,
		} = this.state;

		this.setState({
			showOutput: true,
			isRunning: true,
			inputsPopupOpened: false,
		});

		const compiledCode = await this.compileCode(sourceCode, language, inputs);
		this.setState({
			inputs: '',
		});
		this.showOutput(language, compiledCode.output);
	}

	closeComments = () => {
		this.setState({ commentsOpened: false });
	}

	openComments = () => {
		this.setState({ commentsOpened: true });
	}

	handleInputsPopupClose = () => {
		this.setState({
			inputsPopupOpened: false,
			inputs: '',
		});
	}

	handleInputsChange = (e) => {
		this.setState({
			inputs: e.target.value,
		});
	}

	render() {
		const {
			id,
			type,
			code,
			mode,
			theme,
			jsCode,
			inputs,
			cssCode,
			publicID,
			codeType,
			isRunning,
			sourceCode,
			showOutput,
			isGettingCode,
			commentsOpened,
			languageSelector,
			userCodeLanguage,
			shouldShowToolbar,
			inputsPopupOpened,
			latestSavedCodeData,
		} = this.state;
		const {
			t,
			withBottomToolbar,
		} = this.props;

		const inputsPopupActions = [
			<FlatButton
				label={t('common.submit-action-title')}
				primary
				onTouchTap={this.runCondeWithInputs}
			/>,
		];

		const showWebOutput = showOutput && (type === 'web' || type === 'combined');
		const programRunning = isRunning && (type === 'web' || type === 'combined');

		return (
			isGettingCode ?
				<LoadingOverlay /> :
				<div id="playground-container" style={styles.playgroundContainer}>
					<Paper id="playground" style={styles.playground.base}>
						<PlaygroundTabs
							type={type}
							mode={mode}
							theme={theme}
							runCode={this.runCode}
							handleTabChange={this.handleTabChange}
						/>
						<Editor
							code={code}
							mode={mode}
							theme={theme}
							publicID={publicID}
							showWebOutput={showWebOutput}
							handleEditorChange={this.handleEditorChange}
						/>
						<OutputWindow
							type={type}
							showWebOutput={showWebOutput}
							programRunning={programRunning}
						/>
						<Toolbar
							type={type}
							mode={mode}
							theme={theme}
							jsCode={jsCode}
							cssCode={cssCode}
							code={sourceCode}
							isRunning={isRunning}
							runCode={this.runCode}
							language={userCodeLanguage}
							showWebOutput={showWebOutput}
							insertToHead={this.insertToHead}
							isUserCode={codeType === 'userCode'}
							userCodeData={latestSavedCodeData}
							languageSelector={languageSelector}
							resetEditorValue={this.resetEditorValue}
							setLatestSavedData={this.setLatestSavedData}
							handleEditorChange={this.handleEditorChange}
							handleThemeChange={this.handleThemeChange}
							handleLanguageChange={this.handleLanguageChange}
						/>
						{ (withBottomToolbar && shouldShowToolbar) &&
							<BottomToolbar
								codeData={latestSavedCodeData}
								openComments={this.openComments}
							/>
						}
						<Paper
							className="default-output-container"
							style={{
								...styles.defaultOutputContainer.base,
								...(showOutput && type === 'default' ? styles.defaultOutputContainer.show : {}),
							}}
						>
							{!(isRunning && type === 'default') ? null
								: <LoadingOverlay size={30} />
							}
							<div style={styles.outputHeader}>Output: </div>
							<pre className="default-output" style={styles.defaultOutput} />
						</Paper>
						<Comments
							id={id}
							type={1}
							commentsType="code"
							closeComments={this.closeComments}
							commentsOpened={commentsOpened}
						/>
						<Dialog
							open={inputsPopupOpened}
							title={texts.inputsPopupTitle}
							titleStyle={styles.popupTitle}
							bodyStyle={styles.popupBody}
							actions={inputsPopupActions}
							contentStyle={styles.popupContent}
							onRequestClose={this.handleInputsPopupClose}
						>
							<p style={styles.popupSubTitle}>{texts.savePopupSubTitle}</p>
							<TextField
								multiLine
								fullWidth
								id="inputs"
								value={inputs}
								style={styles.inputStyle}
								onChange={this.handleInputsChange}
							/>
						</Dialog>
					</Paper>
				</div>
		);
	}
}

export default translate()(Playground);
