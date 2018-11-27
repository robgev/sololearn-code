import SplitPane from 'react-split-pane';
import 'styles/Playground/SplitPaneStyles.scss';
import PlaygroundTabs from './PlaygroundTabs';
import Toolbar from './Toolbar';
import OutputWindow from './OutputWindow';

class Playground extends Component {
	state = {
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
		fullScreen: false,
		showOutput: false,
		isGettingCode: true,
		latestSavedCodeData: {},
		languageSelector: 'web',
		userCodeLanguage: 'web',
		shouldShowToolbar: false,
		inputsPopupOpened: false,
	};


	handleThemeChange = (e, isInputChecked) => {}

	resetEditorValue = () => {}

	wrapByTag = (code, tag) => {
		const hasTag = code ? code.includes(tag) : false;
		if (!hasTag) {
			return (
				`<${tag}>
						${code || ''}
</${tag}>`
			);
		}
		return code;
	}

	addResourceValueAfterTag = (code, value, tag) => {
		const tagOpeningPosition = code.indexOf(tag);
		const precedingSubstr = code.slice(0, tagOpeningPosition);
		const succeedingSubstr = code.slice(tagOpeningPosition);
		return (
			`${precedingSubstr}
	${value || ''}
${succeedingSubstr}
							`
		);
	}

	wrapAndAdd = (code, value) => {
		const hasTag = code ? code.includes('head') : false;
		const wrappedCode = this.wrapByTag(code, 'html');
		const headWrappedValue =
			`<head>
						${value}
</head >
						`;
		const codeToBeAdded = hasTag ? value : headWrappedValue;
		const tagToBeAddedBefore = hasTag ? '</head' : '</html';
		return this.addResourceValueAfterTag(wrappedCode, codeToBeAdded, tagToBeAddedBefore);
	}

	insertToHead = (value) => {
		const { sourceCode } = this.state;
		return this.wrapAndAdd(sourceCode, value);
	}

	getStructurizeWebCode() {
		const { cssCode, jsCode } = this.state;
		return this.insertToHead(`<style>${cssCode || ''}</style><script>${jsCode || ''}</script>`);
	}

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
			languageSelector: languageAlias,
			latestSavedCodeData: { language },
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
			ReactGA.ga('send', 'screenView', { screenName: 'Code Output Page (html)' });
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
			ReactGA.ga('send', 'screenView', { screenName: 'Code Output Page (html)' });
		} else if (this.checkForInput(languageAlias)) {
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
			ReactGA.ga('send', 'screenView', { screenName: 'Code Output Page' });
		}
	}

	runCodeWithInputs = async () => {
		const {
			inputs,
			sourceCode,
			latestSavedCodeData: { language },
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
		ReactGA.ga('send', 'screenView', { screenName: 'Code Output Page' });
	}

	maximizeInlineCode = () => {
		const { params: { primary, secondary }, query, basePath } = this.props;
		console.log(basePath);
		browserHistory.push(basePath);
		browserHistory.push({ pathname: `/playground/${primary}/${secondary}`, query });
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
			fullScreen,
			sourceCode,
			showOutput,
			isGettingCode,
			languageSelector,
			userCodeLanguage,
			shouldShowToolbar,
			inputsPopupOpened,
			latestSavedCodeData,
		} = this.state;
		const {
			t,
			inline,
			withTopToolbar,
			loadingComponent,
		} = this.props;

		const showWebOutput = showOutput && (type === 'web' || type === 'combined');
		const programRunning = isRunning && (type === 'web' || type === 'combined');

		return (
					<div id="playground-container" style={styles.playgroundContainer}>
						<Paper id="playground" style={styles.playground.base}>
							<div>
								<div style={{ position: 'relative', height: showWebOutput ? 0 : inline ? '300px' : fullScreen ? 'calc(100vh - 166px)' : '60vh' }}>
									<SplitPane
										maxSize={0}
										primary="first"
										split="horizontal"
										allowResize={showOutput && type === 'default'}
										defaultSize={showOutput && type === 'default' ? 'calc(100% - 200px)' : '100%'}
									>
										<Editor
											inline={inline}
											code={code}
											mode={mode}
											theme={theme}
											publicID={publicID}
											fullScreen={fullScreen}
											showWebOutput={showWebOutput}
											handleEditorChange={this.handleEditorChange}
										/>
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
											<div style={styles.outputHeader}>{t('code_playground.output')}</div>
											<pre className="default-output" style={styles.defaultOutputContainer.defaultOutput} />
										</Paper>
									</SplitPane>
								</div>
								<OutputWindow
									type={type}
									showWebOutput={showWebOutput}
									programRunning={programRunning}
								/>
								<Toolbar
									type={type}
									mode={mode}
									theme={theme}
									inline={inline}
									jsCode={jsCode}
									cssCode={cssCode}
									code={sourceCode}
									isRunning={isRunning}
									runCode={this.runCode}
									language={userCodeLanguage}
									setNewState={this.setNewState}
									showToolbar={this.showToolbar}
									showWebOutput={showWebOutput}
									insertToHead={this.insertToHead}
									isUserCode={codeType === 'userCode'}
									userCodeData={latestSavedCodeData}
									languageSelector={languageSelector}
									resetEditorValue={this.resetEditorValue}
									handleEditorChange={this.handleEditorChange}
									handleThemeChange={this.handleThemeChange}
									handleLanguageChange={this.handleLanguageChange}
								/>
							</div>
		);
	}
}

export default translate()(Playground);
