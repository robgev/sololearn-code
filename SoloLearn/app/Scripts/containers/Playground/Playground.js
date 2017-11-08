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
			mode: 'html',
			type: 'web',
			theme: 'monokai',
			languageSelector: 'html',
			isGettingCode: false,
			isSaving: false,
			isRunning: false,
			showOutput: false,
			codeData: null,
			code: '',
		};
	}

	componentDidMount() {
		const customUserCodeHashLength = 12;
		const { params } = this.props;
		if (!params.primary && !params.secondary) {
			this.setDefaultSettings();
		} else if (params.primary.length !== customUserCodeHashLength) {
			// if first param is not auto-generated id with predefined length
			const isNumber = params.secondary.match(/\d+/);
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
					codeData,
					mode: foundEditorSettingKey,
					languageSelector: isWeb ? 'html' : foundEditorSettingKey,
				});
			}

			this.loadEditor();
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
		this.setState({
			code,
			mode,
			showOutput: false,
			languageSelector: 'html',
		});
		// TODO: Change mode
	}

	handleEditorChange = (editorValue) => {
		const { type, mode, codeData } = this.state;
		if (type === 'web') {
			switch (mode) {
			case 'html':
				this.setState({ codeData: { ...codeData, sourceCode: editorValue } });
				break;
			case 'css':
				this.setState({ codeData: { ...codeData, cssCode: editorValue } });
				break;
			case 'javascript':
				this.setState({ codeData: { ...codeData, jsCode: editorValue } });
				break;
			default:
				break;
			}
		} else {
			const newSourceCodeData = { ...codeData, sourceCode: editorValue };
			this.setState({ codeData: newSourceCodeData });
		}
	}

	render() {
		const {
			type,
			mode,
			theme,
			isSaving,
			codeData,
			isRunning,
			showOutput,
			isGettingCode,
			languageSelector,
		} = this.state;
		const {
			jsCode,
			cssCode,
			codeType,
			sourceCode,
		} = codeData;
		const showWebOutput = (showOutput && (type === 'web' || type === 'combined'));
		const { alias } = editorSettings[mode];

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
							type={type}
							alias={alias}
							mode={mode}
							theme={theme}
							jsCode={jsCode}
							cssCode={cssCode}
							codeType={codeType}
							userCodeData={codeData}
							sourceCode={sourceCode}
							isGettingCode={isGettingCode}
						/>
						<Toolbar
							type={type}
							theme={theme}
							isSaving={isSaving}
							isRunning={isRunning}
							showWebOutput={showWebOutput}
							languageSelector={languageSelector}
						/>
					</Paper>
				</div>
		);
	}
}

export default Playground;
